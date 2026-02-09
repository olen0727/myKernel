
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kernel API"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173"] # Strict CORS

    # Auth
    SECRET_KEY: str = "development_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OAuth (Optional for Mock Mode)
    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    
    GITHUB_CLIENT_ID: str | None = None
    GITHUB_CLIENT_SECRET: str | None = None
    
    # Frontend URL for redirect
    FRONTEND_URL: str = "http://localhost:5173"

    # CouchDB
    COUCHDB_URL: str = "http://localhost:5984"
    COUCHDB_USER: str
    COUCHDB_PASSWORD: str

    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.SECRET_KEY == "development_secret_key":
            print("WARNING: You are using the default SECRET_KEY. This is insecure for production.")

@lru_cache()
def get_settings():
    return Settings()
