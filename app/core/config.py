import os
import re
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "ismr-engine-service"
    VERSION: str = "2.0.0"
    
    RAW_DB_URL: str = os.getenv("DATABASE_URL", "")
    if not RAW_DB_URL:
        raise ValueError("DATABASE_URL is missing from .env file")
        
    ASYNC_DB_URL: str = re.sub(r'^postgresql:', 'postgresql+asyncpg:', RAW_DB_URL).split("?")[0]
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()