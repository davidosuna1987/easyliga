import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  const user = auth.user

  if (!user) {
    if (from) {
      return navigateTo(from.path)
    } else if (to.path !== '/') {
      return navigateTo('/')
    }
  }
})
