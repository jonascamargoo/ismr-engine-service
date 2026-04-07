from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_db, get_current_user
from app.models.user import UserDB
from app.models.preference import UserPreferenceDB
from app.schemas.preference import PreferenceResponse, PreferenceUpdate

router = APIRouter(prefix="/preferences", tags=["Preferences"])

@router.get("", response_model=PreferenceResponse)
async def get_preferences(
    current_user: UserDB = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    stmt = select(UserPreferenceDB).where(UserPreferenceDB.user_id == current_user.id)
    result = await db.execute(stmt)
    preferences = result.scalar_one_or_none()
    
    if not preferences:
        raise HTTPException(status_code=404, detail="Preferences not found")
        
    return preferences

@router.put("", response_model=PreferenceResponse)
async def update_preferences(
    updated_preferences: PreferenceUpdate, 
    current_user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(UserPreferenceDB).where(UserPreferenceDB.user_id == current_user.id)
    result = await db.execute(stmt)
    preferences = result.scalar_one_or_none()
    
    if not preferences:
        raise HTTPException(status_code=404, detail="Preferences not found")
    
    if updated_preferences.ai_personality is not None:
        preferences.ai_personality = updated_preferences.ai_personality
    if updated_preferences.read_only_headphones is not None:
        preferences.read_only_headphones = updated_preferences.read_only_headphones
    if updated_preferences.focus_mode_active is not None:
        preferences.focus_mode_active = updated_preferences.focus_mode_active
    if updated_preferences.hide_sensitive_data is not None:
        preferences.hide_sensitive_data = updated_preferences.hide_sensitive_data
    
    await db.commit()
    await db.refresh(preferences)
    
    return preferences