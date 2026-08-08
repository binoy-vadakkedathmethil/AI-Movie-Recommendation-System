from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth
from app.core.database import Base, engine

# Import models so SQLAlchemy knows about them
from app.models import User


Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="AI Movie Recommendation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"]
)


@app.get("/")
def root():

    return {
        "message": "AI Movie Recommendation API is running"
    }