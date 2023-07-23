// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    // private keys
    // apiSecret: "123",
    public: {
      // public keys
      appUrl: process.env.APP_URL,
      apiUrl: process.env.API_URL,
    },
    devtools: { enabled: true },
  },
})
