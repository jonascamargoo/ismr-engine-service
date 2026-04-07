from pydantic import BaseModel
from typing import Optional
from enum import Enum

class AIPersonalityEnum(str, Enum):
    HELPFUL = "Helpful and polite"
    DIRECT = "Short and blunt"
    SARCASTIC = "Sarcastic and humorous"
    FORMAL = "Formal and professional"

class PreferenceBase(BaseModel):
    ai_personality: AIPersonalityEnum
    read_only_headphones: bool
    focus_mode_active: bool
    hide_sensitive_data: bool

class PreferenceUpdate(BaseModel):
    ai_personality: Optional[AIPersonalityEnum] = None
    read_only_headphones: Optional[bool] = None
    focus_mode_active: Optional[bool] = None
    hide_sensitive_data: Optional[bool] = None

class PreferenceResponse(PreferenceBase):
    user_id: str

    class Config:
        from_attributes = True