<script setup lang="ts">
type BeforeInstallPromptEvent = Event & {
  prompt: () => void
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const { t } = useI18n()

const installPrompt = ref<BeforeInstallPromptEvent>()
const showBanner = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault() // Evita que el navegador lo muestre automáticamente
    installPrompt.value = event as BeforeInstallPromptEvent
    showBanner.value = true // Muestra el banner cuando la PWA está lista para instalarse
  })
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', () => {
    installPrompt.value = undefined
  })
})

const installApp = async () => {
  if (installPrompt.value) {
    installPrompt.value.prompt() // Muestra el diálogo de instalación nativo
    const choice = await installPrompt.value.userChoice
    if (choice.outcome === 'accepted') {
      console.log('El usuario aceptó la instalación')
    } else {
      console.log('El usuario canceló la instalación')
    }
    showBanner.value = false // Oculta el banner después de la acción
  }
}

const dismissBanner = () => {
  showBanner.value = false
}
</script>

<template>
  <div
    v-if="showBanner"
    class="w-[95vw] max-w-sm md:w-max md:max-w-none fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between z-50"
  >
    <span class="leading-5">{{ t('forms.install_app') }} 🚀</span>
    <button
      @click="installApp"
      class="text-center w-full md:w-fit mt-4 md:mt-0 md:ml-4 px-6 py-3 md:px-4 md:py-1 bg-white text-primary rounded cursor-pointer"
    >
      {{ t('forms.install') }}
    </button>
    <button
      @click="dismissBanner"
      class="absolute top-2 right-3 md:static md:ml-4 text-white cursor-pointer hover:text-danger"
    >
      <EasyIcon name="times" />
    </button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'EasyInstallPrompt',
}
</script>
