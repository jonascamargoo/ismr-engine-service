# ISMR Engine Service

Sistema de gerenciamento inteligente de notificações com IA. O ISMR usa o **Google Gemini** para reprocessar e reescrever notificações do Android de acordo com as preferências do usuário (personalidade da IA, modo foco, privacidade e regras de silenciamento por app).

O projeto é um monorepo com três partes:

| Pasta | O que é | Stack |
|-------|---------|-------|
| `app/` + `main.py` | **Backend** — API REST assíncrona | FastAPI · SQLAlchemy 2.0 async · PostgreSQL (Neon) · JWT · Google Gemini |
| `ui/` | **PWA web** — cliente com suporte offline/background-sync | React 19 · Vite · Ant Design · Framer Motion |
| `mobile/` | **App Android nativo** — porta a experiência do PWA | React Native · Expo (Expo Router) · TypeScript |

> Trabalho acadêmico — Desenvolvimento Mobile (CEFET-MG). A **Entrega 02** consiste em portar o PWA para um app nativo (`mobile/`) e publicar uma Release no GitHub com um `.apk` funcional.

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
- Background sync: `syncManager.ts` enfileira POST/PUT no IndexedDB quando offline; o runtime caching do Vite PWA reenvia ao voltar a conexão
- Páginas: `LoginPage`, `RegisterPage`, `HomePage`, `PreferencePage`, `UserPage`

### Mobile (`mobile/`)

React Native + Expo (Expo Router, roteamento por arquivos, TypeScript). Porta as telas, identidade e tema do PWA para um cliente Android nativo.

- URL base da API em `mobile/config.ts` → `process.env.EXPO_PUBLIC_API_URL` (espelha o `ui/src/config.ts`)
- Auth: `context/AuthContext.tsx` guarda a sessão JWT; token persistido com `expo-secure-store`
- Dados: `hooks/use-fetch.ts` e `hooks/use-mutation.ts` (wrappers auth-aware/offline-aware sobre `fetch`)
- Rede/offline: `hooks/use-network.ts` (`@react-native-community/netinfo`) + `components/ui/Offline.tsx`
- Tema: `hooks/use-theme-storage.ts` (light/dark via `AsyncStorage`)
- Navegação: `Stack` (auth gate) + `Tabs` (Home, Settings, Profile)

**Recursos nativos mapeados do PWA → Expo** (requisito da Entrega 02):

| API do navegador (PWA) | Equivalente Expo (mobile) |
|------------------------|---------------------------|
| Notification API (`ui/src/main.jsx`) | `expo-notifications` (`hooks/use-notifications.ts`) |
| Vibration API (`ui/src/hooks/useVibration.js`) | `expo-haptics` (`hooks/use-haptics.ts`) |

---

## Como rodar

### Backend

Python fixado em **3.13** (`.python-version`); gerência de dependências com **uv**.

```bash
# Servidor de dev com hot reload (o objeto FastAPI `app` está em main.py na raiz)
uv run uvicorn main:app --reload

# Para testar de um dispositivo físico na mesma rede, escute em todas as interfaces:
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Swagger UI em `http://127.0.0.1:8000/docs`.

### PWA

```bash
cd ui
npm install
npm run dev        # Vite dev server em http://localhost:5173
npm run build      # build de produção → ui/dist/
npm run lint       # ESLint
```

### Mobile

```bash
cd mobile
npm install
npx expo start     # Expo dev server — abra no Expo Go ou em um emulador Android
npm run android    # roda direto em um device/emulador Android
npm run lint       # ESLint (expo lint)
```

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

**Mobile** (`mobile/.env`):

```
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000   # dev local; aponte para a URL do Render em builds de produção
```

---

## Build e Release do app mobile (Entrega 02)

O perfil `production` em `mobile/eas.json` gera um `.apk` (em vez do `.aab` padrão da Play Store), pronto para instalação direta no Android. A URL do backend de produção (Render) já está fixada no `env` desse perfil — o `.env` local **não** é usado nos builds da nuvem do EAS.

> **Cold start do Render (free tier):** o backend "dorme" após ~15 min de inatividade. Antes de demonstrar o APK, acorde-o abrindo `https://ismr-engine-service.onrender.com/docs` e aguarde carregar — senão o primeiro login parecerá travado por 30-60s.

```bash
cd mobile
npx eas-cli login
npx eas-cli init                                    # uma vez — vincula o projeto à conta Expo
npx eas-cli build -p android --profile production   # gera o .apk
```

Depois, crie a tag e a Release anexando o `.apk`:

```bash
git tag vX.Y.Z && git push origin vX.Y.Z
gh release create vX.Y.Z caminho/para/app.apk --title "vX.Y.Z" --notes "Release do app mobile"
```

**Release atual:** [`v1.0.0`](https://github.com/jonascamargoo/ismr-engine-service/releases/tag/v1.0.0) (APK Android, ~87 MB).

> **Nota:** o `.apk` instala apenas em **Android**. iPhone exige um `.ipa` + conta Apple Developer.

---

## Limitações conhecidas

- A **missão central** (ler as notificações que chegam no sistema e entregar um resumo) ainda **não está implementada** em nenhum cliente. O botão "Ear" na home apenas simula (dispara uma notificação local). Capturar notificações de outros apps exigiria um `NotificationListenerService` nativo no Android — planejado para a próxima entrega.
- O mascaramento de dados sensíveis (privacidade) é delegado ao LLM (best-effort), sem mascaramento determinístico/regex.
