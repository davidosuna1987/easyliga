import { ToastMessageOptions } from 'primevue/toast'

export type ToastOptions = ToastMessageOptions

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | undefined

export const DEFAULT_OPTIONS: ToastMessageOptions = {
  severity: undefined,
  life: 3000,
  closable: true,
}
