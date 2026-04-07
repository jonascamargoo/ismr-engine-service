import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from app.db.database import Base

class UserDB(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    display_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # A MÁGICA ACONTECE AQUI: Adicione timezone=True
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    preferences = relationship("UserPreferenceDB", back_populates="owner", uselist=False, cascade="all, delete-orphan")
    app_overrides = relationship("AppOverrideDB", cascade="all, delete-orphan")