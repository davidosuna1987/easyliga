<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'

const props = defineProps({
  items: {
    type: Array<MenuItem>,
  },
})
</script>

<template>
  <nav class="easy-navbar">
    <div class="easy-navbar__wrapper">
      <Menubar class="easy-navbar__container" :model="items">
        <template #start>
          <NavbarLogo />
        </template>
        <template #item="props">
          <NavbarItem :item="props.item" />
        </template>
        <template #end>
          <LangSwitcher />
          <slot name="end" />
        </template>
      </Menubar>
    </div>
  </nav>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'NavbarWeb',
}
</script>
