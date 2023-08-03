import { UseFetchOptions } from 'nuxt/app'
import { useAuthStore } from '@/stores/useAuthStore'

export function useApi<T>(path: string, options: UseFetchOptions<T> = {}) {
  const auth = useAuthStore()
  const runtimeConfig = useRuntimeConfig()

  let headers: Record<string, string> = {}

  if (auth?.token) {
    headers['Authorization'] = `Bearer ${auth.token}`
  }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(['cookie']),
      referer: runtimeConfig.public.appUrl,
    }
  }

  const response = useFetch(`${runtimeConfig.public.apiUrl}/${path}`, {
    credentials: 'include',
    watch: false,
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        auth.setInitialState()
        navigateTo('/login')
      }

      if (response.status === 403) {
        auth.setInitialState()
        navigateTo('/login')
      }
    },
  })

  return response
}
