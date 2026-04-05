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
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found")
        
    return prefs

@router.put("", response_model=PreferenceResponse)
async def update_preferences(
    updated_prefs: PreferenceUpdate, 
    current_user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(UserPreferenceDB).where(UserPreferenceDB.user_id == current_user.id)
    result = await db.execute(stmt)
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found")
    
    if updated_prefs.ai_personality is not None:
        prefs.ai_personality = updated_prefs.ai_personality
    if updated_prefs.read_only_headphones is not None:
        prefs.read_only_headphones = updated_prefs.read_only_headphones
    if updated_prefs.focus_mode_active is not None:
        prefs.focus_mode_active = updated_prefs.focus_mode_active
    if updated_prefs.hide_sensitive_data is not None:
        prefs.hide_sensitive_data = updated_prefs.hide_sensitive_data
    
    await db.commit()
    await db.refresh(prefs)
    
    return prefs