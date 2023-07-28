import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  if (!auth.user) {
    if (from) {
      return navigateTo(from.path)
    } else if (to.path !== '/') {
      return navigateTo('/')
    }
  }

  if (!auth.isAdminOrHasRole('referee')) {
    return navigateTo('/')
  }
})
