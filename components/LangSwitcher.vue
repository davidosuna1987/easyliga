<script setup lang="ts">
import locales from '@/locales'

const i18n = useI18n()

const setAppLocale = (locale: string) => {
  i18n.locale.value = locale
  localStorage.setItem('locale', locale)
}
</script>

<template>
  <div class="easy-lang-switcher">
    <p>{{ $t('hello', { name: 'David' }) }}</p>
    <button
      v-for="locale in locales"
      :key="locale.code"
      @click="setAppLocale(locale.code)"
    >
      {{ locale.name }}
    </button>
  </div>
</template>
