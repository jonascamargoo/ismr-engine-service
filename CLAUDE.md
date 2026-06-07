# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ISMR Engine Service is an AI-powered notification management system. It uses Google Gemini to reprocess and rewrite Android notifications based on user preferences (personality, focus mode, privacy, per-app muting rules). The backend is a FastAPI async API; there are two clients consuming it: a React PWA (`ui/`) with offline/background-sync support, and a React Native/Expo Android app (`mobile/`) that ports the same experience to a native client.

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

```bash
cd mobile

npm install
npx expo start     # Expo dev server — open in Expo Go or an Android emulator
npm run android    # Launch directly on an Android device/emulator
npm run lint       # ESLint (expo lint)
```

Requires a `mobile/.env` (see Environment Variables below). Read `mobile/AGENTS.md` (Expo v54 docs pointer) before changing native-facing code.

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

### Mobile (`mobile/`)

React Native + Expo (Expo Router, file-based routing, TypeScript). Ports the PWA's screens, identity and theme to a native Android client.

**Key patterns:**
- API base URL from `mobile/config.ts` → `process.env.EXPO_PUBLIC_API_URL` (falls back to `http://127.0.0.1:8000`), mirroring `ui/src/config.ts`
- Auth: `context/AuthContext.tsx` holds the JWT/user session; token persisted with `expo-secure-store`
- Data layer: `hooks/use-fetch.ts` and `hooks/use-mutation.ts` (GET / POST·PUT·PATCH·DELETE wrappers around `fetch`, auth-aware, offline-aware)
- Network/offline: `hooks/use-network.ts` (`@react-native-community/netinfo`) + `components/ui/Offline.tsx` banner
- Theme: `hooks/use-theme-storage.ts` persists light/dark preference via `AsyncStorage`, read through `useColorScheme` and `constants/theme.ts` (`Colors`, `Fonts`)
- Navigation: Expo Router `Stack` (`app/_layout.tsx`, auth gate redirecting between `(tabs)` and `/login`) + bottom `Tabs` (`app/(tabs)/_layout.tsx`: Home, Settings, Profile)

**Native resources (mapped from the PWA's browser APIs, per the Entrega 02 checklist):**
- Notification API (`ui/src/main.jsx`) → `expo-notifications` (`hooks/use-notifications.ts`, permission flow + local notifications)
- Vibration API (`ui/src/hooks/useVibration.js`) → `expo-haptics` (`hooks/use-haptics.ts`, used on tab presses and the listening button)

**Screens**: `login`, `register`, `(tabs)/index` (home — listening toggle), `(tabs)/settings` (AI preferences), `(tabs)/profile` (user data + logout).

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

Mobile requires `mobile/.env`:

```
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000   # Backend URL for local dev — point to the Render URL for production builds
```
