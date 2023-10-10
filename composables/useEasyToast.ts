import { useToast } from 'primevue/usetoast'
import { ToastOptions, ToastSeverity } from '@/types/toast'
import { DEFAULT_OPTIONS } from '@/domain/toast'

export default function useEasyToast() {
  const toast = useToast()
  const app = useNuxtApp()

  const showToast = (
    message: string,
    severity: ToastSeverity,
    options: ToastOptions = DEFAULT_OPTIONS,
  ) => {
    toast.add({
      detail: message,
      life: 5000,
      closable: true,
      group: 'app',
      ...options,
      severity,
    })
  }

  const success = (message: string, options?: ToastOptions) => {
    showToast(message, 'success', options)
  }

  const info = (message: string, options?: ToastOptions) => {
    showToast(message, 'info', options)
  }

  const warn = (message: string, options?: ToastOptions) => {
    showToast(message, 'warn', options)
  }

  const error = (message: string, options?: ToastOptions) => {
    showToast(message, 'error', options)
  }

  const correctErrors = () => {
    error(app.$i18n.t('errors.correct_before_proceed'))
  }

  const mapError = (
    errorValue: unknown[],
    forceCorrectErrors: boolean = true,
  ) => {
    if (forceCorrectErrors) {
      correctErrors()
      return
    }
    if (errorValue instanceof Array) {
      const errors = errorValue[0]
      if (errors instanceof Array) {
        error(errors[0])
      } else {
        error(String(errorValue[0]))
      }
    } else {
      correctErrors()
    }
  }

  return {
    success,
    info,
    warn,
    error,
    correctErrors,
    mapError,
  }
}
