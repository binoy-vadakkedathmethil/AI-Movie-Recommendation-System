from fastapi import APIRouter, HTTPException, Query

from app.ml.model_loader import RecommendationModelLoader
from app.services.recommendation_service import (
    RecommendationService,
)
from app.schemas.recommendation import (
    RecommendationResponse,
    SimilarMoviesResponse,
    PopularMoviesResponse,
)


router = APIRouter(
    prefix="/api",
    tags=["Recommendations"]
)


recommendation_service = RecommendationService()


@router.get(
    "/recommendations/health"
)
def recommendation_health():

    model = recommendation_service.model

    return {
        "status": "ok",
        "model_version": model.config.get(
            "model_version"
        ),
        "movie_count": len(
            model.movies
        ),
        "content_matrix": list(
            model.weighted_matrix.shape
        ),
        "cf_user_factors": list(
            model.user_factors.shape
        ),
        "cf_movie_factors": list(
            model.movie_factors.shape
        ),
        "ratings_count": len(
            recommendation_service.ratings
        )
    }

@router.get("/recommendations/search")
def search_movies(
    query: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50) 
):
    return recommendation_service.search_movies(
        query=query,
        limit=limit
    )
@router.get("/recommendations/by-genre")
def get_movies_by_genre(
    genre: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50)
):
    return recommendation_service.get_movies_by_genre(
        genre=genre,
        limit=limit
    )

@router.get(
    "/recommendations/{user_id}",
    response_model=RecommendationResponse
)
def get_recommendations(
    user_id: int,
    limit: int = Query(
        default=10,
        ge=1,
        le=50
    )
):

    result = recommendation_service.get_recommendations(
        user_id=user_id,
        n=limit
    )

    recommendations = result["recommendations"]

    return {
        "user_id": user_id,
        "model": result["model"],
        "count": len(recommendations),
        "recommendations": recommendations
    }


@router.get(
    "/movies/{movie_id}/similar",
    response_model=SimilarMoviesResponse
)
def get_similar_movies(
    movie_id: int,
    limit: int = Query(
        default=10,
        ge=1,
        le=50
    )
):

    recommendations = (
        recommendation_service
        .get_similar_movies(
            movie_id=movie_id,  
            n=limit
        )
    )

    if recommendations is None:
        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    return {
        "movie_id": movie_id,
        "count": len(
            recommendations
        ),
        "recommendations": recommendations
    }


@router.get(
    "/movies/popular",
    response_model=PopularMoviesResponse
)
def get_popular_movies(
    limit: int = Query(
        default=10,
        ge=1,
        le=50
    )
):

    recommendations = (
        recommendation_service
        .get_popular_movies(
            n=limit
        )
    )

    return {
        "count": len(
            recommendations
        ),
        "recommendations": recommendations
    }
