from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

from app.ml.model_loader import RecommendationModelLoader


class RecommendationService:

    def __init__(self):
        self.model = RecommendationModelLoader()

        self.project_root = Path(__file__).resolve().parents[3]

        self.processed_dir = (
            self.project_root
            / "ml"
            / "datasets"
            / "processed"
        )

        self._load_ratings()

    def _load_ratings(self):
        """
        Temporary runtime ratings source.

        Phase 3 generated ratings_train.csv.
        Later this will be replaced by the backend database
        so newly submitted ratings are immediately available.
        """

        ratings_path = (
            self.processed_dir
            / "ratings_train.csv"
        )

        if not ratings_path.exists():
            raise FileNotFoundError(
                f"Training ratings file not found: "
                f"{ratings_path}"
            )

        self.ratings = pd.read_csv(
            ratings_path
        )

        required_columns = {
            "userId",
            "movieId",
            "rating"
        }

        missing = required_columns.difference(
            self.ratings.columns
        )

        if missing:
            raise ValueError(
                f"Ratings file is missing columns: {missing}"
            )

        print(
            f"Loaded training ratings: "
            f"{len(self.ratings)}"
        )

    # ---------------------------------------------------------
    # Utility
    # ---------------------------------------------------------

    @staticmethod
    def _minmax(values):

        values = np.asarray(
            values,
            dtype=float
        )

        minimum = np.nanmin(values)
        maximum = np.nanmax(values)

        if maximum == minimum:
            return np.zeros_like(values)

        return (
            values - minimum
        ) / (
            maximum - minimum
        )

    def _movie_response(
        self,
        row,
        score=None
    ):

        year = row.get("year")

        if pd.isna(year):
            year = None
        else:
            year = int(year)

        rating = row.get(
            "average_rating"
        )

        if pd.isna(rating):
            rating = None
        else:
            rating = float(rating)

        rating_count = row.get(
            "rating_count"
        )

        if pd.isna(rating_count):
            rating_count = None
        else:
            rating_count = int(
                rating_count
            )

        return {
            "movie_id": int(
                row["movieId"]
            ),
            "title": str(
                row.get(
                    "clean_title",
                    row.get("title", "")
                )
            ),
            "year": year,
            "genres": (
                None
                if pd.isna(row.get("genres"))
                else str(row.get("genres"))
            ),
            "average_rating": rating,
            "rating_count": rating_count,
            "score": (
                None
                if score is None
                else float(score)
            )
        }

    # ---------------------------------------------------------
    # User history
    # ---------------------------------------------------------

    def _get_user_ratings(
        self,
        user_id: int
    ):

        return self.ratings[
            self.ratings["userId"] == user_id
        ]

    # ---------------------------------------------------------
    # Content-based user profile
    # ---------------------------------------------------------

    def _build_user_vector(
        self,
        user_id: int
    ):

        positive_threshold = float(
            self.model.config.get(
                "positive_rating_threshold",
                4.0
            )
        )

        history = self.ratings[
            (self.ratings["userId"] == user_id)
            &
            (
                self.ratings["rating"]
                >= positive_threshold
            )
        ].copy()

        if history.empty:
            return None

        history["matrix_index"] = (
            history["movieId"]
            .map(
                self.model.movie_to_index
            )
        )

        history = history.dropna(
            subset=["matrix_index"]
        )

        if history.empty:
            return None

        indexes = (
            history["matrix_index"]
            .astype(int)
            .to_numpy()
        )

        vectors = (
            self.model.weighted_matrix[
                indexes
            ]
        )

        weights = (
            history["rating"]
            .to_numpy(dtype=float)
            - 3
        )

        weight_sum = weights.sum()

        if weight_sum == 0:
            return None

        return (
            vectors.multiply(
                weights[:, None]
            ).sum(axis=0)
            / weight_sum
        )

    # ---------------------------------------------------------
    # Content scores
    # ---------------------------------------------------------

    def _content_scores(
        self,
        user_id: int
    ):

        user_vector = self._build_user_vector(
            user_id
        )

        if user_vector is None:
            return None

        return cosine_similarity(
            user_vector,
            self.model.weighted_matrix
        ).ravel()

    # ---------------------------------------------------------
    # Collaborative scores
    # ---------------------------------------------------------

    def _collaborative_scores(
        self,
        user_id: int
    ):

        if user_id not in self.model.user_to_index:
            return None

        user_index = self.model.user_to_index[
            user_id
        ]

        raw_scores = (
            self.model.user_factors[user_index]
            @
            self.model.movie_factors.T
        )

        score_series = pd.Series(
            raw_scores,
            index=self.model.movie_ids,
            dtype=float
        )

        # Map CF movie scores to the complete
        # Phase 2 movie list.
        scores = (
            self.model.movies["movieId"]
            .map(score_series)
            .fillna(0.0)
            .to_numpy()
        )

        return scores

    # ---------------------------------------------------------
    # Similar movies
    # ---------------------------------------------------------

    def get_similar_movies(
        self,
        movie_id: int,
        n: int = 10
    ):

        if movie_id not in self.model.movie_to_index:
            return None

        movie_index = self.model.movie_to_index[
            movie_id
        ]

        similarity_scores = cosine_similarity(
            self.model.weighted_matrix[
                movie_index
            ],
            self.model.weighted_matrix
        ).ravel()

        result = self.model.movies.copy()

        result["score"] = similarity_scores

        # Remove selected movie.
        result = result[
            result["movieId"] != movie_id
        ]

        # Phase 2 minimum rating-count filter.
        result = result[
            result["rating_count"] >= 100
        ]

        result = (
            result
            .sort_values(
                "score",
                ascending=False
            )
            .head(n)
        )

        return [
            self._movie_response(
                row,
                row["score"]
            )
            for _, row in result.iterrows()
        ]

    # ---------------------------------------------------------
    # Hybrid recommendations
    # ---------------------------------------------------------

    def get_recommendations(
        self,
        user_id: int,
        n: int = 10
    ):

        content_scores = (
            self._content_scores(
                user_id
            )
        )

        # No positive history → cold start.
        if content_scores is None:
            return {
                "model": "popular",
                "recommendations": self.get_popular_movies(
                    n
                )
            }

        result = self.model.movies.copy()

        result["content_score"] = (
            self._minmax(
                content_scores
            )
        )

        collaborative_scores = (
            self._collaborative_scores(
                user_id
            )
        )

        if collaborative_scores is None:

            result["collaborative_score"] = 0.0

        else:

            result["collaborative_score"] = (
                self._minmax(
                    collaborative_scores
                )
            )

        content_weight = float(
            self.model.config.get(
                "content_weight",
                0.5
            )
        )

        collaborative_weight = float(
            self.model.config.get(
                "collaborative_weight",
                0.5
            )
        )

        result["score"] = (
            content_weight
            * result["content_score"]
            +
            collaborative_weight
            * result["collaborative_score"]
        )

        # Remove movies already rated by user.
        rated_movie_ids = set(
            self._get_user_ratings(
                user_id
            )["movieId"]
        )

        result = result[
            ~result["movieId"].isin(
                rated_movie_ids
            )
        ]

        result = (
            result
            .sort_values(
                "score",
                ascending=False
            )
            .head(n)
            .reset_index(drop=True)
        )

        recommendations = [
            self._movie_response(
                row,
                row["score"]
            )
            for _, row in result.iterrows()
        ]

        return {
            "model": "hybrid",
            "recommendations": recommendations
        }

    # ---------------------------------------------------------
    # Popular / cold-start recommendations
    # ---------------------------------------------------------
    def get_popular_movies(self, n: int = 10):

        popularity = (
            self.ratings
            .groupby("movieId")["rating"]
            .agg(
                rating_count="count",
                average_rating="mean"
            )
            .reset_index()
        )

        # Phase 6 cold-start rule
        popularity = popularity[
            popularity["rating_count"] >= 20
        ]

        popularity = popularity.sort_values(
            [
                "average_rating",
                "rating_count"
            ],
            ascending=[
                False,
                False
            ]
        )

        movie_data = self.model.movies[
            [
                "movieId",
                "title",
                "year",
                "genres"
            ]
        ]

        result = popularity.merge(
            movie_data,
            on="movieId",
            how="inner"
        ).head(n)

        # Convert DataFrame → list of dictionaries
        return result.to_dict(orient="records")
    
    def search_movies(self, query: str, limit: int = 10):

        query = query.strip().lower()

        if not query:
            return []

        title_match = (
            self.model.movies["title"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(query, regex=False)
        )

        genre_match = (
            self.model.movies["genres"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(query, regex=False)
        )

        results = self.model.movies[
            title_match | genre_match
        ].head(limit)

        return results[
            [
                "movieId",
                "title",
                "genres",
                "year",
                "average_rating",
                "rating_count"
            ]
        ].to_dict(orient="records")
    
    def get_movies_by_genre(self, genre: str, limit: int = 10):
        genre = genre.strip().lower()

        if not genre:
            return []

        genre_match = (
            self.model.movies["genres"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(genre, regex=False)
        )

        results = self.model.movies[genre_match].head(limit)

        return results[
            ["movieId", "title", "genres", "year", "average_rating", "rating_count"]
        ].to_dict(orient="records")
