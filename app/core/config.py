import os
import re
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "ismr-engine-service"
    VERSION: str = "2.0.0"
    
    # Database
    RAW_DB_URL: str = os.getenv("DATABASE_URL", "")
    if not RAW_DB_URL:
        raise ValueError("DATABASE_URL is missing from .env file")
        
    ASYNC_DB_URL: str = re.sub(r'^postgresql:', 'postgresql+asyncpg:', RAW_DB_URL).split("?")[0]
    
    # JWT Auth (Vamos usar nas próximas etapas)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 dias

settings = Settings()