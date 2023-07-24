// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  runtimeConfig: {
    // private keys
    // apiSecret: "123",
    public: {
      appUrl: process.env.APP_URL,
      apiUrl: process.env.API_URL,
    },
    devtools: { enabled: true },
  },
})
