# ISMR Engine Service

Sistema de gerenciamento inteligente de notificações com IA. O ISMR usa o **Google Gemini** para reprocessar e reescrever notificações do Android de acordo com as preferências do usuário (personalidade da IA, modo foco, privacidade e regras de silenciamento por app).

O projeto é um monorepo com três partes:

| Pasta | O que é | Stack |
|-------|---------|-------|
| `app/` + `main.py` | **Backend** — API REST assíncrona | FastAPI · SQLAlchemy 2.0 async · PostgreSQL (Neon) · JWT · Google Gemini |
| `ui/` | **PWA web** — cliente com suporte offline/background-sync | React 19 · Vite · Ant Design · Framer Motion |
| `mobile/` | **App Android nativo** — porta a experiência para Kotlin | Kotlin · Jetpack Compose · Retrofit · Coroutines |

> Trabalho acadêmico — Desenvolvimento Mobile (CEFET-MG). A **Entrega 3.2** consiste em um app Android **nativo (Kotlin/Jetpack Compose)** em `mobile/`, com ≥2 telas Compose, ≥1 chamada de API e ≥1 recurso nativo, publicado como Release no GitHub com um `.apk` funcional.

---

## Arquitetura

### Backend (`app/`)

API totalmente assíncrona (engine async do SQLAlchemy 2.0, driver `asyncpg`, rotas async do FastAPI).

**Rotas** (`app/api/routes/`):

- `auth.py` — registro (cria usuário + preferências padrão) e login (retorna JWT de 7 dias)
- `users.py` — `GET/PUT/DELETE /users/me` (cascade-delete de preferências + overrides)
- `preferences.py` — configurações de comportamento da IA por usuário
- `overrides.py` — regras de silenciamento por app
- `engine.py` — endpoint principal de processamento (`POST /engine/process`)

**Fluxo do engine** (`engine.py` → `ai_service.py`):

1. Verifica se o app está silenciado para o usuário (short-circuit se estiver)
2. Busca as preferências do usuário
3. Monta dinamicamente a instrução de sistema do Gemini a partir das preferências
4. Chama a API do Gemini (`gemini-3.1-flash-lite-preview`, temperatura 0.0)
5. Retorna JSON com `processed_message` e `is_important`

**Banco de dados** (`app/db/database.py`): PostgreSQL no Neon Cloud. Três tabelas — `users`, `user_preferences` (1:1) e `app_overrides` (1:N). Todos os relacionamentos têm cascade delete a partir do usuário.

**Autenticação** (`app/core/security.py`, `app/api/deps.py`): OAuth2 com JWT (HS256), extraído do header `Authorization: Bearer` via a dependência `get_current_user`.

### PWA (`ui/src/`)

React 19 + Vite + Ant Design. Mistura `.jsx`/`.tsx`.

- URL base da API em `src/config.ts` → `import.meta.env.VITE_API_URL` (fallback `http://127.0.0.1:8000`)
- Suporte offline: hook `useOnlineStatus` + componente `Offline.jsx`
- Background sync: `syncManager.ts` enfileira POST/PUT no IndexedDB quando offline
- Páginas: `LoginPage`, `RegisterPage`, `HomePage`, `PreferencePage`, `UserPage`

### Mobile (`mobile/`) — Android nativo (Kotlin)

App Android nativo em **Kotlin + Jetpack Compose**, consumindo o backend via **Retrofit + Coroutines** (padrão ViewModel + StateFlow). Detalhes completos em [`mobile/README.md`](mobile/README.md).

- Base URL da API em `network/RetrofitClient.kt` → `https://ismr-engine-service.onrender.com`
- Auth: login OAuth2 → JWT guardado em `network/TokenManager.kt`, injetado por interceptor OkHttp
- Navegação: `MainActivity.kt` (gate de login) + `NavHost` + bottom bar
- Telas: `Login`, `Home`, `Preferences`, `Profile` (`ui/screens/`)

**Entrega 3.2 — requisitos e onde estão:**

| Requisito | Implementação |
|-----------|---------------|
| ≥2 telas Jetpack Compose | `Login`, `Home`, `Preferences`, `Profile` (`mobile/app/.../ui/screens/`) |
| ≥1 chamada de API | `POST /auth/login`, `GET /preferences`, `PUT /preferences` (`mobile/app/.../network/ApiService.kt`) |
| ≥1 recurso nativo | **Vibração** (`Vibrator`) e **Notificação local** (`NotificationCompat`), na `Home.kt` |

---

## Como rodar

### Backend

Python fixado em **3.13** (`.python-version`); gerência de dependências com **uv**.

```bash
# Servidor de dev com hot reload (o objeto FastAPI `app` está em main.py na raiz)
uv run uvicorn main:app --reload

# Para testar de um dispositivo físico na mesma rede:
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Swagger UI em `http://127.0.0.1:8000/docs`.

### PWA

```bash
cd ui
npm install
npm run dev        # Vite dev server em http://localhost:5173
npm run build      # build de produção → ui/dist/
```

### Mobile (Kotlin)

Requer **Android Studio** (Android SDK) + **JDK 17+**.

```bash
cd mobile
./gradlew assembleDebug     # -> app/build/outputs/apk/debug/app-debug.apk
```

Ou abra `mobile/` no Android Studio e use **Build > Build APK(s)**. Login de demonstração já pré-preenchido: usuário `demo`, senha `ismr1234`.

---

## Variáveis de ambiente

**Backend** (`.env` na raiz):

```
DATABASE_URL=postgresql+asyncpg://...   # PostgreSQL do Neon com SSL
SECRET_KEY=...                          # chave de assinatura do JWT
GEMINI_API_KEY=...                      # chave da API Google GenAI
```

**PWA** (`ui/.env`):

```
VITE_API_URL=http://127.0.0.1:8000      # URL do backend para dev local
```

O app **mobile** não usa arquivo de ambiente — a base URL fica em `mobile/app/src/main/java/com/example/ismr/network/RetrofitClient.kt`.

---

## Release do APK (Entrega 3.2)

A Release **[`v3.0.0`](https://github.com/jonascamargoo/ismr-engine-service/releases/tag/v3.0.0)** já está publicada, com o `app-debug.apk` anexado ([download direto](https://github.com/jonascamargoo/ismr-engine-service/releases/download/v3.0.0/app-debug.apk)).

O APK é gerado **na nuvem** por um workflow do **GitHub Actions** (`.github/workflows/build-apk.yml`) — não precisa de Android SDK local. Ele builda `mobile/` (`assembleDebug`) nos runners do GitHub e, ao dar push numa tag `v*`, cria a Release com o `.apk` anexado:

```bash
git tag vX.Y.Z && git push origin vX.Y.Z   # dispara o build e publica a Release
```

Também dá pra rodar o workflow manualmente (aba **Actions** → *Build Android APK* → *Run workflow*) e baixar o APK pelo *artifact*. Build local é opcional (`cd mobile && ./gradlew assembleDebug`, requer Android Studio/SDK).

> Login de demonstração no app: usuário `demo`, senha `ismr1234`.

> ⚠️ **Cold start do Render:** o backend "dorme" após ~15 min ociosos; o primeiro login pode levar 30–60s. Abra `https://ismr-engine-service.onrender.com/docs` antes de demonstrar.

> A versão anterior (React Native/Expo, Entrega 02) está preservada na tag `v1.0.0` e na branch `entrega-02-final`.

---

## Limitações conhecidas

- A **missão central** (capturar as notificações que chegam no sistema e resumir) ainda **não está implementada** — exigiria um `NotificationListenerService` nativo. O botão da Home apenas simula (vibra + dispara uma notificação local).
- O mascaramento de dados sensíveis (privacidade) é delegado ao LLM (best-effort), sem regex determinístico.
