from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_db, get_current_user
from app.models.user import UserDB
from app.models.preference import UserPreferenceDB
from app.models.app_override import AppOverrideDB
from app.schemas.notification import NotificationInput, NotificationOutput
from app.services.ai_service import process_notification_with_ai

router = APIRouter(prefix="/engine", tags=["ISMR Engine"])

@router.post("/process", response_model=NotificationOutput)
async def process_incoming_notification(
    payload: NotificationInput,
    current_user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. INTERCEPT: Check if the user muted this specific app
    stmt_override = select(AppOverrideDB).where(
        AppOverrideDB.user_id == current_user.id,
        AppOverrideDB.app_name == payload.app_name
    )
    result_override = await db.execute(stmt_override)
    app_rule = result_override.scalar_one_or_none()
    
    # If the rule exists and is_muted is True, block the AI request immediately
    if app_rule and app_rule.is_muted:
        return NotificationOutput(
            original_app=payload.app_name,
            processed_message="Notification ignored due to user settings.",
            is_important=False,
            should_read_aloud=False
        )

    # 2. Fetch global preferences
    stmt_preferences = select(UserPreferenceDB).where(UserPreferenceDB.user_id == current_user.id)
    result_preferences = await db.execute(stmt_preferences)
    preferences = result_preferences.scalar_one_or_none()
    
    if not preferences:
        raise HTTPException(status_code=404, detail="User preferences not found.")
        
    # 3. Only send to Gemini if the app is not muted
    processed_result = await process_notification_with_ai(payload, preferences)
    
    return processed_result