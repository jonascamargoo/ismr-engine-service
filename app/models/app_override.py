import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey
from app.db.database import Base

class AppOverrideDB(Base):
    __tablename__ = "app_overrides"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    app_name = Column(String, index=True, nullable=False)
    is_muted = Column(Boolean, default=True, nullable=False)