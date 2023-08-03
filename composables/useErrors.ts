import { ApiErrors, AlertError } from '@/types/errors'

export function useErrors(apiErrors: ApiErrors = {}) {
  const errors = ref<AlertError>({
    show: false,
    list: apiErrors,
  })

  const setErrors = (apiErrors: ApiErrors) => {
    if (apiErrors.length) {
      errors.value.show = true
    }
    errors.value.list = apiErrors
  }

  const setShow = (show: boolean) => (errors.value.show = show)
  const clearErrors = () => (errors.value.list = [])

  return {
    errors,
    setShow,
    setErrors,
    clearErrors,
  }
}
