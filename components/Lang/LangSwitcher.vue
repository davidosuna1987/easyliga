<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import {
  locales,
  getLocaleIconName,
  FALLBACK_LOCALE_ICON,
} from '@/config/locale'

const { locale } = useI18n()

const langMenu = ref()

const icon = computed((): string => {
  const flag =
    locales.find(item => item.code === locale.value)?.flag ??
    FALLBACK_LOCALE_ICON
  return getLocaleIconName(flag)
})
</script>

<template>
  <div class="easy-lang-switcher-component">
    <LangTrigger :icon="icon" @click="langMenu.toggle($event)" />
    <TieredMenu ref="langMenu" :model="(locales as MenuItem[])" popup>
      <template #item="props">
        <LangItem :item="props.item" />
      </template>
    </TieredMenu>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LangSwitcher',
}
</script>
