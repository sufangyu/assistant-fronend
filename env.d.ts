/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API BASE 配置 */
  readonly VITE_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}