from pydantic import BaseModel
from typing import Optional

class PreferenceBase(BaseModel):
    ai_personality: str
    read_only_headphones: bool
    focus_mode_active: bool
    hide_sensitive_data: bool

class PreferenceUpdate(BaseModel):
    ai_personality: Optional[str] = None
    read_only_headphones: Optional[bool] = None
    focus_mode_active: Optional[bool] = None
    hide_sensitive_data: Optional[bool] = None

class PreferenceResponse(PreferenceBase):
    user_id: str

    class Config:
        from_attributes = True