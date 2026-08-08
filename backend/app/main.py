from fastapi import FastAPI

from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Movie Recommendation API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Backend Running Successfully"
    }