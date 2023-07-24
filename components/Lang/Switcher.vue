<script setup lang="ts">
import locales from '@/locales'
import { setAppLocale } from '@/domain/lang/lang'

const i18n = useI18n()
</script>

<template>
  <div class="easy-lang-switcher">
    <p>{{ $t('hello', { name: 'David' }) }}</p>
    <button
      v-for="locale in locales"
      :key="locale.code"
      @click="setAppLocale(i18n, locale.code)"
    >
      {{ locale.name }}
    </button>
  </div>
</template>
