# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Build de produção (APK) e Release no GitHub

O perfil `production` em `eas.json` gera um `.apk` (build type `apk`, em vez do `.aab` padrão para a Play Store), pronto para instalação direta no Android. A URL do backend de produção (Render) já está fixada no `env` desse perfil — o `.env` local (que aponta para dev) **não** é usado nos builds da nuvem do EAS.

> **Cold start do Render (free tier):** o backend "dorme" após ~15 min de inatividade. Antes de instalar/demonstrar o APK, acorde-o abrindo `https://ismr-engine-service.onrender.com/docs` e aguarde carregar — senão o primeiro login parecerá travado por 30-60s.

1. **Autentique e vincule o projeto à sua conta Expo** (uma vez só — gera `extra.eas.projectId` no `app.json`):
   ```bash
   npx eas-cli login
   npx eas-cli init
   ```
2. (Opcional) Confira o identificador do app em `app.json` → `expo.android.package` (atualmente `com.jonascamargo.ismr`).
3. Gere o build:
   ```bash
   npx eas-cli build -p android --profile production
   ```
4. Baixe o `.apk` gerado (o EAS fornece um link ao final do build, ou `npx eas-cli build:list` / `npx eas-cli build:download`).
5. Crie a tag e a Release no repositório, anexando o executável:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   gh release create vX.Y.Z caminho/para/app.apk --title "vX.Y.Z" --notes "Release do app mobile (Entrega 02)"
   ```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
