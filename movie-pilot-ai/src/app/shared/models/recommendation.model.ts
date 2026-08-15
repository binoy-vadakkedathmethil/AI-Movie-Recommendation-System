export interface MovieRecommendation {
  movie_id: number;
  title: string;
  year: number | null;
  genres: string | null;
  average_rating: number | null;
  rating_count: number | null;
  score: number | null;
}

export interface RecommendationResponse {
  user_id: number;
  model: string;
  count: number;
  recommendations: MovieRecommendation[];
}

export interface SimilarMoviesResponse {
  movie_id: number;
  count: number;
  recommendations: MovieRecommendation[];
}

export interface PopularMoviesResponse {
  count: number;
  recommendations: MovieRecommendation[];
}