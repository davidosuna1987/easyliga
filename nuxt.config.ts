// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  spaLoadingTemplate: false,
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-icon',
    '@kevinmarrec/nuxt-pwa',
    '@nuxtjs/color-mode',
  ],
  runtimeConfig: {
    // private keys
    pusherAppSecret: process.env.PUSHER_APP_SECRET,
    // public keys
    public: {
      appEnv: process.env.APP_ENV,
      appName: process.env.APP_NAME,
      appDescription: process.env.APP_DESCRIPTION,
      appUrl: process.env.APP_URL,
      apiUrl: process.env.API_URL,
      pusherAppKey: process.env.PUSHER_APP_KEY,
      pusherAppHost: process.env.PUSHER_APP_HOST,
    },
    devtools: { enabled: true },
  },
  css: ['@/assets/css/app.scss'],
  build: {
    transpile: ['primevue'],
  },
  pwa: {
    workbox: {
      enabled: false,
    },
    manifest: {
      name: process.env.APP_NAME,
      short_name: process.env.APP_NAME,
      description: process.env.APP_DESCRIPTION,
      theme_color: '#ffffff',
      lang: 'es',
    },
  },
})
