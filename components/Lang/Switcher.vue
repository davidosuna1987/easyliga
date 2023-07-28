<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import { locales } from '@/config/locale'
import { getLangIcon } from '@/domain/locale'

const { locale } = useI18n()

const langMenu = ref()
</script>

<template>
  <div class="easy-lang-switcher-component">
    <LangIcon
      :icon="getLangIcon(locale)"
      size="2rem"
      @click="langMenu.toggle($event)"
    />
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
