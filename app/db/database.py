from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

engine = create_async_engine(
    settings.ASYNC_DB_URL, 
    echo=False,
    pool_pre_ping=True, # Garante que a conexão está viva antes de executar a query
    connect_args={
        "ssl": "require",
        "statement_cache_size": 0 # Desliga o cache agressivo do asyncpg (salva vidas no Dev!)
    }
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()