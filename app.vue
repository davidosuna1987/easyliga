<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  title: config.public.appName as string,
  meta: [
    {
      name: 'description',
      content: config.public.appDescription as string,
    },
    {
      name: 'theme-color',
      content: '#ffffff',
    },
    {
      name: 'msapplication-TileColor',
      content: '#ffffff',
    },
    {
      name: 'msapplication-config',
      content: '/favicons/browserconfig.xml',
    },
  ],
  link: [
    {
      rel: 'shortcut icon',
      href: '/favicons/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicons/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicons/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicons/favicon-16x16.png',
    },
    {
      rel: 'manifest',
      href: '/favicons/site.webmanifest',
    },
    {
      rel: 'mask-icon',
      href: '/favicons/safari-pinned-tab.svg',
      color: '#fdc39b',
    },
  ],
  bodyAttrs: {
    class: 'easy-body',
  },
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <Alerts />
    </NuxtLayout>
  </div>
</template>
