# ISMR — App Android (Kotlin + Jetpack Compose)

Cliente Android **nativo** do ISMR (Kotlin + Jetpack Compose). Porta a experiência do PWA/React Native para um app nativo e consome o backend FastAPI (`../app`, hospedado no Render).

> **Entrega 3.2 — Desenvolvimento Mobile (CEFET-MG).** Esta seção mapeia cada requisito avaliado para onde ele está no código.

## Requisitos da Entrega 3.2

### 1. Telas em Jetpack Compose (mínimo 2) ✅
| Tela | Arquivo |
|------|---------|
| **Login** | `app/src/main/java/com/example/ismr/ui/screens/Login.kt` |
| **Home** (botão de escuta) | `app/src/main/java/com/example/ismr/ui/screens/Home.kt` |
| **Preferências** | `app/src/main/java/com/example/ismr/ui/screens/Preferences.kt` |
| **Perfil** | `app/src/main/java/com/example/ismr/ui/screens/Profile.kt` |

Navegação em `MainActivity.kt`: gate de login → `NavHost` + bottom bar (`ui/components/Footer.kt`).

### 2. Chamada de API (mínimo 1) ✅
Stack: **Retrofit 2 + OkHttp + Gson + Coroutines**, no padrão **ViewModel + StateFlow** (`network/` e `viewmodel/`).

Backend: `https://ismr-engine-service.onrender.com` (definido em `network/RetrofitClient.kt`).

Chamadas em `network/ApiService.kt`:

| Chamada | Método/rota | Onde |
|---------|-------------|------|
| Login (recebe JWT) | `POST /auth/login` (OAuth2 form) | `viewmodel/AuthViewModel.kt` |
| **Carregar preferências** | `GET /preferences` | `viewmodel/PreferencesViewModel.kt` → `buscarPreferencias()` |
| **Salvar preferências** | `PUT /preferences` | `viewmodel/PreferencesViewModel.kt` → `atualizarPreferencia()` |

O JWT é injetado no header `Authorization: Bearer` por um **interceptor OkHttp** (`network/RetrofitClient.kt`), a partir do `network/TokenManager.kt`.

**Conta demo** (já registrada no backend e pré-preenchida na tela de Login):

```
usuário: demo
senha:   ismr1234
```

> ⚠️ **Cold start do Render (free tier):** o backend "dorme" após ~15 min ociosos. O **primeiro login pode levar 30–60s** — não é travamento. Para acelerar uma demonstração, abra antes `https://ismr-engine-service.onrender.com/docs`.

### 3. Recurso nativo (mínimo 1) ✅ — dois, na tela **Home**
Ambos são acionados ao tocar no botão de microfone (`ui/screens/Home.kt`):

| Recurso | Como é acessado | Permissão |
|---------|-----------------|-----------|
| **Vibração** | `Vibrator` / `VibratorManager` → `vibrate(...)` (100ms ao alternar a escuta) | `VIBRATE` (`AndroidManifest.xml`) |
| **Notificação local** | `NotificationChannel` + `NotificationCompat` → `NotificationManagerCompat.notify(...)` | `POST_NOTIFICATIONS`, solicitada em runtime via `ActivityResultContracts.RequestPermission` |

## Build do APK

Pré-requisitos: **Android Studio** (com Android SDK) + **JDK 17+**.

```bash
# APK debug (instalável direto no dispositivo):
./gradlew assembleDebug
# -> app/build/outputs/apk/debug/app-debug.apk
```

Ou abra a pasta `mobile/` no Android Studio e use **Build > Build App Bundle(s) / APK(s) > Build APK(s)**.

## Stack
- Kotlin · Jetpack Compose · Material 3
- Navigation Compose
- Retrofit 2 + Gson + OkHttp (auth interceptor)
- Coroutines + ViewModel + StateFlow
- `minSdk = 24`, `targetSdk = 36`, `applicationId = com.example.ismr`
