import os
import re
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, String
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.future import select
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# ==========================================
# 1. ENVIRONMENT & DATABASE CONFIGURATION
# ==========================================
load_dotenv()

raw_db_url = os.getenv("DATABASE_URL")
if not raw_db_url:
    raise ValueError("DATABASE_URL is missing from .env file")

ASYNC_DB_URL = re.sub(r'^postgresql:', 'postgresql+asyncpg:', raw_db_url)

ASYNC_DB_URL = ASYNC_DB_URL.split("?")[0]

engine = create_async_engine(
    ASYNC_DB_URL, 
    echo=False,
    connect_args={"ssl": "require"}
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

FIXED_USER_ID = "00000000-0000-0000-0000-000000000001"

# ==========================================
# 2. DATABASE MODEL
# ==========================================
class UserPreferenceDB(Base):
    __tablename__ = "user_preference"

    user_id = Column(String, primary_key=True, index=True)
    default_language = Column(String, default="Portuguese - Brazil")
    verbosity = Column(String, default="Contextual")
    default_voice = Column(String, default="Maria - Female")
    delivery_frequency = Column(String, default="Fast - 2x/min")

# ==========================================
# 3. VALIDATION SCHEMAS
# ==========================================
class PreferenceBase(BaseModel):
    default_language: str
    verbosity: str
    default_voice: str
    delivery_frequency: str

class PreferenceResponse(PreferenceBase):
    user_id: str

    class Config:
        from_attributes = True

class NotificationPayload(BaseModel):
    app_name: str
    raw_text: str

class SimulatedAIResponse(BaseModel):
    original_text: str
    processed_text: str
    applied_verbosity: str
    system_prompt_used: str

# ==========================================
# 4. LIFESPAN CONTEXT MANAGER
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as db:
        stmt = select(UserPreferenceDB).where(UserPreferenceDB.user_id == FIXED_USER_ID)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            new_user = UserPreferenceDB(user_id=FIXED_USER_ID)
            db.add(new_user)
            await db.commit()            
    yield
    
    await engine.dispose()

# ==========================================
# 5. FASTAPI INITIALIZATION
# ==========================================

app = FastAPI(
    title="ismr-engine-service",
    description="Async backend engine for notification reading and AI processing.",
    version="1.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# ==========================================
# 6. MOCK AI FUNCTION
# ==========================================
async def mock_llm_call(system_prompt: str, user_text: str) -> str:
    if "Contextual" in system_prompt:
        return f"Urgent context detected: '{user_text}'."
    elif "Curto" in system_prompt or "Short" in system_prompt:
        return f"New message: {user_text[:10]}..."
    else:
        return f"Full message: {user_text}"

# ==========================================
# 7. ENDPOINTS
# ==========================================
@app.get("/preferences", response_model=PreferenceResponse)
async def get_preferences(db: AsyncSession = Depends(get_db)):
    stmt = select(UserPreferenceDB).where(UserPreferenceDB.user_id == FIXED_USER_ID)
    result = await db.execute(stmt)
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return prefs

@app.put("/preferences", response_model=PreferenceResponse)
async def update_preferences(updated_prefs: PreferenceBase, db: AsyncSession = Depends(get_db)):
    stmt = select(UserPreferenceDB).where(UserPreferenceDB.user_id == FIXED_USER_ID)
    result = await db.execute(stmt)
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        raise HTTPException(status_code=404, detail="User not found")
    
    prefs.default_language = updated_prefs.default_language
    prefs.verbosity = updated_prefs.verbosity
    prefs.default_voice = updated_prefs.default_voice
    prefs.delivery_frequency = updated_prefs.delivery_frequency
    
    await db.commit()
    await db.refresh(prefs)
    
    return prefs

@app.post("/simulate-ai", response_model=SimulatedAIResponse)
async def simulate_ai_processing(payload: NotificationPayload, db: AsyncSession = Depends(get_db)):
    stmt = select(UserPreferenceDB).where(UserPreferenceDB.user_id == FIXED_USER_ID)
    result = await db.execute(stmt)
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found to process AI")
    
    user_verbosity = prefs.verbosity

    base_prompt = (
        f"You are a helpful voice assistant for a busy professional. "
        f"Read the following notification from the app '{payload.app_name}'. "
    )
    
    if user_verbosity == "Contextual":
        system_prompt = base_prompt + "Analyze the context. If it is urgent, explain it. If it is trivial, summarize it in one sentence."
    elif user_verbosity == "Curto":
        system_prompt = base_prompt + "Summarize the notification in a maximum of 5 words."
    else:
        system_prompt = base_prompt + "Read the exact text of the notification clearly."

    ai_result = await mock_llm_call(system_prompt=system_prompt, user_text=payload.raw_text)

    return SimulatedAIResponse(
        original_text=payload.raw_text,
        processed_text=ai_result,
        applied_verbosity=user_verbosity,
        system_prompt_used=system_prompt
    )
    
