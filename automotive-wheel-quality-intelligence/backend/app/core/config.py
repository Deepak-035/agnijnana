import os
from typing import List


class Settings:
    PROJECT_NAME: str = "Aluminium Wheel Quality Intelligence"
    API_V1_STR: str = "/api"

    # Environment & Security
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev_secret_key_insecure_default")
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8000")

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://quality_user:quality_secret@localhost:5432/quality_db"
    )

    # AI Models Path
    MODEL_PATH: str = os.getenv("MODEL_PATH", "ai/defect_detection/models/")

    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5188,http://127.0.0.1:5188,http://localhost:5173,http://localhost:3000").split(",")
        if origin.strip()
    ]


settings = Settings()
