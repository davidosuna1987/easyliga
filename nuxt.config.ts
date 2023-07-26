// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
  ],
  runtimeConfig: {
    // private keys
    // apiSecret: "123",
    public: {
      appEnv: process.env.APP_ENV,
      appName: process.env.APP_NAME,
      appDescription: process.env.APP_DESCRIPTION,
      appUrl: process.env.APP_URL,
      apiUrl: process.env.API_URL,
    },
    devtools: { enabled: true },
  },
  css: ['@/assets/css/main.scss'],
  build: {
    transpile: ['primevue'],
  },
})
