from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import jwt

from app.db.database import AsyncSessionLocal
from app.core.config import settings
from app.models.user import UserDB

# Diz para o Swagger onde fica a rota de login para o botão "Authorize" funcionar
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Tenta quebrar o token usando a nossa chave secreta
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    # Busca o usuário no banco
    stmt = select(UserDB).where(UserDB.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
        
    return user