/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_BUILDING_DATA_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
