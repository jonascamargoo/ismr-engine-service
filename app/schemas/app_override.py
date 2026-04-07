from pydantic import BaseModel

class AppOverrideCreate(BaseModel):
    app_name: str
    is_muted: bool

class AppOverrideResponse(BaseModel):
    id: str
    app_name: str
    is_muted: bool

    class Config:
        from_attributes = True