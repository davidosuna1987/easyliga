<script setup lang="ts">
import { FALLBACK_LOCALE } from '@/domain/locale'
import { MenuItem } from 'primevue/menuitem'

const props = defineProps({
  item: {
    type: Object as PropType<MenuItem>,
    required: true,
  },
})

const { locale } = useI18n()

const lang = ref<string>(FALLBACK_LOCALE)

const setAppLocale = (selectedLocale: string) => {
  lang.value = selectedLocale
  locale.value = selectedLocale
  localStorage.setItem('locale', selectedLocale)
}

onMounted(() => {
  lang.value = localStorage.getItem('locale') || FALLBACK_LOCALE
})
</script>

<template>
  <NuxtLink
    class="easy-navbar__link p-menuitem-link"
    :class="{ 'p-menuitem-link__active': item.code === lang }"
    @click="setAppLocale(item.code)"
  >
    <LangItem :item="item" />
  </NuxtLink>
</template>

<script lang="ts">
export default {
  name: 'LangItemLink',
}
</script>
