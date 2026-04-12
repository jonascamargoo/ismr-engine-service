// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Se você for criar outras variáveis no futuro, coloque-as aqui!
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}