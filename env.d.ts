/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_ELEVENLABS_API_KEY: string
    readonly VITE_DEFAULT_LATITUDE: string
    readonly VITE_DEFAULT_LONGITUDE: string
    readonly VITE_DEBUG_MODE?: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly SSR: boolean
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
    readonly hot?: {
      accept(cb?: (module: any) => void): void
      dispose(cb: (data: any) => void): void
      decline(): void
      invalidate(): void
      on(event: string, listener: (...args: any[]) => void): void
      off(event: string, listener: (...args: any[]) => void): void
      send(event: string, data: any): void
    }
    readonly glob: (glob: string, options?: any) => any
  }
}

declare module "virtual:pwa-register" {
  export interface RegisterSWOptions {
    immediate?: boolean
    scope?: string
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
  }

  export function registerSW(options?: RegisterSWOptions): Promise<ServiceWorkerRegistration | undefined>
}

export {}
