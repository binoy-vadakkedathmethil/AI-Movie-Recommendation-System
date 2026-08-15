from pydantic import BaseModel, Field


class MovieRecommendation(BaseModel):
    movie_id: int
    title: str
    year: int | None = None
    genres: str | None = None
    average_rating: float | None = None
    rating_count: int | None = None
    score: float | None = None


class RecommendationResponse(BaseModel):
    user_id: int
    model: str
    count: int
    recommendations: list[MovieRecommendation]


class SimilarMoviesResponse(BaseModel):
    movie_id: int
    count: int
    recommendations: list[MovieRecommendation]


class PopularMoviesResponse(BaseModel):
    count: int
    recommendations: list[MovieRecommendation]