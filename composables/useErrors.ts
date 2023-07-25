import { ApiError } from '@/domain/errors'

type Errors = {
  show: boolean
  list: ApiError[]
}

export function useErrors(apiErrors: ApiError[] = []) {
  const errors = ref<Errors>({
    show: false,
    list: apiErrors,
  })

  const setErrors = (apiErrors: ApiError[]) => {
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
