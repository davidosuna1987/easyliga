<script setup lang="ts">
import { FALLBACK_LOCALE } from '@/config/locale'
import { MenuItem } from 'primevue/menuitem'
import { getLangIcon } from '@/domain/locale'

const i18n = useI18n()
const lang = ref<string>(FALLBACK_LOCALE)

onMounted(() => {
  lang.value = localStorage.getItem('locale') || FALLBACK_LOCALE
})

const setAppLocale = (selectedLocale: string) => {
  lang.value = selectedLocale
  i18n.locale.value = selectedLocale
  localStorage.setItem('locale', selectedLocale)
}

const props = defineProps({
  item: {
    type: Object as PropType<MenuItem>,
    required: true,
  },
})
</script>

<template>
  <NuxtLink
    class="easy-navbar__link p-menuitem-link"
    :class="{ 'p-menuitem-link__active': item.code === lang }"
    @click="setAppLocale(item.code)"
  >
    <LangIcon :icon="getLangIcon(item.code)" size="1.25rem" /> {{ item.name }}
  </NuxtLink>
</template>

<script lang="ts">
export default {
  name: 'LangItem',
}
</script>
