import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from app.core.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto plano bate com o hash salvo no banco."""
    # O bcrypt trabalha com bytes, então precisamos converter as strings usando encode
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def get_password_hash(password: str) -> str:
    """Gera o hash bcrypt para salvar no banco de dados."""
    # Gera um "sal" aleatório de segurança e aplica o hash
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    # Decodifica de volta para string para podermos salvar na coluna do banco
    return hashed_bytes.decode('utf-8')

def create_access_token(subject: str) -> str:
    """Gera o token JWT contendo o ID do usuário (subject) e a data de expiração."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject)
    }
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt