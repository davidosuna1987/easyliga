<script setup lang="ts">
import locales from '@/locales'
import { FALLBACK_LOCALE } from '@/domain/lang'

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
</script>

<template>
  <div class="easy-lang-switcher">
    <p>{{ $t('hello', { name: 'David' }) }}</p>
    <Dropdown
      :model-value="lang"
      :options="locales"
      option-label="name"
      option-value="code"
      placeholder="Select a language"
      @change="setAppLocale($event.value)"
    />
  </div>
</template>
domain/lang
