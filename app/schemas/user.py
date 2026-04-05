from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    display_name: str
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    display_name: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    username: Optional[str] = None