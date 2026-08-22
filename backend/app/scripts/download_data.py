import gzip
import os
import shutil
from pathlib import Path

import requests


DATA_URL = os.getenv("RATINGS_DATA_URL")

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = BASE_DIR / "ml" / "datasets" / "processed"

OUTPUT_FILE = DATA_DIR / "ratings_train.csv"


def download_ratings():
    if not DATA_URL:
        raise RuntimeError("RATINGS_DATA_URL is not configured")

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    compressed_file = DATA_DIR / "ratings_runtime.csv.gz"

    print("Downloading ratings dataset from Hugging Face...")

    response = requests.get(
        DATA_URL,
        stream=True,
        timeout=1200
    )
    response.raise_for_status()

    with open(compressed_file, "wb") as file:
        for chunk in response.iter_content(chunk_size=1024 * 1024):
            if chunk:
                file.write(chunk)

    print("Download completed.")
    print("Extracting ratings dataset...")

    with gzip.open(compressed_file, "rb") as source:
        with open(OUTPUT_FILE, "wb") as target:
            shutil.copyfileobj(source, target)

    compressed_file.unlink()

    print(f"Ratings dataset ready: {OUTPUT_FILE}")


if __name__ == "__main__":
    download_ratings()