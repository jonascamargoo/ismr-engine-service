from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_db, get_current_user
from app.models.user import UserDB
from app.models.app_override import AppOverrideDB
from app.schemas.app_override import AppOverrideCreate, AppOverrideResponse

router = APIRouter(prefix="/overrides", tags=["App Overrides"])

@router.get("", response_model=list[AppOverrideResponse])
async def get_user_overrides(
    current_user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns all custom rules created by the logged-in user."""
    stmt = select(AppOverrideDB).where(AppOverrideDB.user_id == current_user.id)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("", response_model=AppOverrideResponse)
async def set_app_override(
    override_in: AppOverrideCreate,
    current_user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Creates a new rule or updates an existing one for a specific app."""
    # Check if a rule for this exact app already exists for this user
    stmt = select(AppOverrideDB).where(
        AppOverrideDB.user_id == current_user.id,
        AppOverrideDB.app_name == override_in.app_name
    )
    result = await db.execute(stmt)
    existing_rule = result.scalar_one_or_none()

    if existing_rule:
        existing_rule.is_muted = override_in.is_muted
        await db.commit()
        await db.refresh(existing_rule)
        return existing_rule

    # If it doesn't exist, create it
    new_rule = AppOverrideDB(
        user_id=current_user.id,
        app_name=override_in.app_name,
        is_muted=override_in.is_muted
    )
    db.add(new_rule)
    await db.commit()
    await db.refresh(new_rule)
    return new_rule