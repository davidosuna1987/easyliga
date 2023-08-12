import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  const easyStorage = useEasyStorage()

  if (!auth.user) {
    easyStorage.set('loginRedirect', to.path)

    if (from && from.path !== to.path) {
      return navigateTo(from.path)
    } else if (to.path !== '/') {
      return navigateTo('/')
    }
  }
})
