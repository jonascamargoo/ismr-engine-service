from pydantic import BaseModel

class NotificationInput(BaseModel):
    app_name: str
    sender_name: str
    raw_message: str

class NotificationOutput(BaseModel):
    original_app: str
    processed_message: str
    is_important: bool
    should_read_aloud: bool