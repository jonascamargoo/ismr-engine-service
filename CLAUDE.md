# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ISMR Engine Service is an AI-powered notification management system. It uses Google Gemini to reprocess and rewrite Android notifications based on user preferences (personality, focus mode, privacy, per-app muting rules). The backend is a FastAPI async API; there are two clients consuming it: a React PWA (`ui/`) with offline/background-sync support, and a native Android app (`mobile/`, Kotlin + Jetpack Compose) that ports the same experience to a native client.

## Commands

### Backend

```bash
# Start dev server (hot reload) — the FastAPI `app` object lives in root-level main.py
uv run uvicorn main:app --reload

# To test from a physical device on the same network, bind to all interfaces:
# uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Swagger UI available at http://127.0.0.1:8000/docs
```

Python version is pinned to **3.13** (`.python-version`). Dependency management uses **uv** (`pyproject.toml` / `uv.lock`).

### Frontend

```bash
cd ui

npm run dev        # Vite dev server at http://localhost:5173
npm run build      # Production build → ui/dist/
npm run lint       # ESLint
npm run test-pwa   # PWA service worker test
```

### Mobile

Native Android (Kotlin + Jetpack Compose). Requires Android Studio (Android SDK) + JDK 17+.

```bash
cd mobile
./gradlew assembleDebug   # APK → app/build/outputs/apk/debug/app-debug.apk
```

Or open `mobile/` in Android Studio and use Build > Build APK(s). Demo login prefilled: user `demo`, password `ismr1234`.

## Architecture

### Backend (`app/`)

All backend code is async (SQLAlchemy 2.0 async engine, asyncpg driver, async FastAPI routes).

**Routers** (`app/api/routes/`):
- `auth.py` — register (creates user + default preferences) and login (returns 7-day JWT)
- `users.py` — `GET/PUT/DELETE /users/me` (cascade-deletes preferences + overrides)
- `preferences.py` — AI behavior settings per user (personality, focus mode, privacy)
- `overrides.py` — per-app muting rules
- `engine.py` — main notification processing endpoint (`POST /engine/process`)

**Engine flow** (`engine.py` → `ai_service.py`):
1. Check if the app is muted for the user (short-circuit if so)
2. Fetch user preferences
3. Build a dynamic Gemini system instruction from preferences
4. Call Gemini API (model: `gemini-3.1-flash-lite-preview`, temperature 0.0)
5. Return JSON with `processed_message` and `is_important` fields

**Auth** (`app/core/security.py`, `app/api/deps.py`): OAuth2 with JWT (HS256). Token extracted from `Authorization: Bearer` header via `get_current_user` dependency.

**Database** (`app/db/database.py`): PostgreSQL on Neon Cloud. Three tables: `users`, `user_preferences` (1:1), `app_overrides` (1:many). All relationships cascade delete from user.

**Config** (`app/core/config.py`): Reads `DATABASE_URL`, `SECRET_KEY`, and `GEMINI_API_KEY` from environment / `.env`.

### Frontend (`ui/src/`)

React 19 + Vite + Ant Design + Framer Motion. Mixed `.jsx`/`.tsx`.

**Key patterns:**
- API base URL from `src/config.ts` → `import.meta.env.VITE_API_URL` (falls back to `http://127.0.0.1:8000`)
- Offline support: `useOnlineStatus` hook + `Offline.jsx` component shown when disconnected
- Background sync: `syncManager.ts` queues POST/PUT to IndexedDB when offline; Vite PWA runtime caching replays them to `ismr-engine-service.onrender.com` when back online
- PWA manifest configured in `vite.config.js` (standalone display, auto-update on refresh)
- ngrok domain allowlist in `vite.config.js` for tunneled dev access

**Pages**: `LoginPage`, `RegisterPage`, `HomePage` (main notification UI), `PreferencePage`, `UserPage`.

### Mobile (`mobile/`) — Android nativo (Kotlin)

Native Android app in **Kotlin + Jetpack Compose**, consuming the backend via **Retrofit + Coroutines** (ViewModel + StateFlow). See `mobile/README.md`. Package `com.example.ismr`.

**Key patterns:**
- API base URL hardcoded in `network/RetrofitClient.kt` → `https://ismr-engine-service.onrender.com`
- Auth: `POST /auth/login` (OAuth2 form) → JWT held in `network/TokenManager.kt` (in-memory), injected as `Authorization: Bearer` by an OkHttp interceptor in `RetrofitClient.kt`
- Data layer: `network/ApiService.kt` (Retrofit interface) + `viewmodel/*ViewModel.kt` (StateFlow + `UiState` sealed class)
- Navigation: `MainActivity.kt` — login gate (`AuthViewModel`), then `NavHost` + bottom bar (`ui/components/Footer.kt`)

**Native resources (Home screen, `ui/screens/Home.kt`, on the mic button):**
- Vibration — `Vibrator`/`VibratorManager` (permission `VIBRATE`)
- Local notification — `NotificationChannel` + `NotificationCompat` (runtime permission `POST_NOTIFICATIONS` via `ActivityResultContracts.RequestPermission`)

**Screens** (`ui/screens/`): `Login`, `Home` (listening toggle), `Preferences` (AI settings via `GET/PUT /preferences`), `Profile`.

## Environment Variables

Backend requires a `.env` file:

```
DATABASE_URL=postgresql+asyncpg://...   # Neon PostgreSQL with SSL
SECRET_KEY=...                          # JWT signing key
GEMINI_API_KEY=...                      # Google GenAI API key
```

Frontend requires `ui/.env` (or Vite env):

```
VITE_API_URL=http://127.0.0.1:8000     # Backend URL for local dev
```

The **mobile** app has no env file — the backend base URL is hardcoded in `mobile/app/src/main/java/com/example/ismr/network/RetrofitClient.kt`.
