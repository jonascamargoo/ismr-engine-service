from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class UserPreferenceDB(Base):
    __tablename__ = "user_preferences"

    # user_id is now both the PK and the FK
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    
    ai_personality = Column(String, default="Helpful Assistant")
    read_only_headphones = Column(Boolean, default=False)
    focus_mode_active = Column(Boolean, default=False)
    hide_sensitive_data = Column(Boolean, default=True)

    owner = relationship("UserDB", back_populates="preferences")