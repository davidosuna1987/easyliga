import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(() => {
  const app = useNuxtApp()

  app.$pinia.use(
    createPersistedState({
      auto: true,
      storage: localStorage,
    }),
  )
})
