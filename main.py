from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Este é o engine do banco de dados
from app.db.database import engine, Base

# Usamos o 'as engine_route' para dar um apelido e evitar a colisão!
from app.api.routes import auth, preferences, users, overrides
from app.api.routes import engine as engine_route 

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Agora ele sabe que esse 'engine' é o do banco de dados
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="ISMR Engine API", 
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(preferences.router)
app.include_router(users.router)
app.include_router(overrides.router)

app.include_router(engine_route.router)

@app.get("/")
async def root():
    return {"message": "ISMR Engine is running!"}