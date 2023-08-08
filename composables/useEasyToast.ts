import { useToast } from 'primevue/usetoast'
import { ToastOptions, ToastSeverity } from '@/types/toast'
import { DEFAULT_OPTIONS } from '@/domain/toast'

export default function useEasyToast(options: ToastOptions = DEFAULT_OPTIONS) {
  const toast = useToast()
  const app = useNuxtApp()

  const showToast = (message: string, severity: ToastSeverity) => {
    toast.add({
      ...options,
      severity: severity,
      detail: message,
      life: 5000,
      closable: true,
      group: 'app',
    })
  }

  const success = (message: string) => {
    showToast(message, 'success')
  }

  const info = (message: string) => {
    showToast(message, 'info')
  }

  const warn = (message: string) => {
    showToast(message, 'warn')
  }

  const error = (message: string) => {
    showToast(message, 'error')
  }

  const mapError = (errorValue: unknown[]) => {
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

  const correctErrors = () => {
    error(app.$i18n.t('errors.correct_before_proceed'))
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
