from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.db.database import engine, Base
from app.api.routes import auth, preferences, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Cria as tabelas novas (users e user_preference) no Neon
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="ISMR Engine API", 
    version="2.0.0",
    lifespan=lifespan
)

# Configuração de CORS para o frontend do seu amigo conseguir consumir a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, coloque a URL do Vercel/Netlify dele aqui
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra as rotas
app.include_router(auth.router)
app.include_router(preferences.router)
app.include_router(users.router)

# Rota raiz de teste de saúde
@app.get("/")
async def root():
    return {"message": "ISMR Engine is running!"}