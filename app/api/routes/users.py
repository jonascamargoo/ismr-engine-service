from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_db, get_current_user
from app.models.user import UserDB
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def read_user_me(current_user: UserDB = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_in: UserUpdate,
    current_user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user_in.username is not None and user_in.username != current_user.username:
        stmt = select(UserDB).where(UserDB.username == user_in.username)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Username already in use")
        current_user.username = user_in.username
        
    if user_in.display_name is not None:
        current_user.display_name = user_in.display_name
        
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_me(
    current_user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await db.delete(current_user)
    await db.commit()
    return None