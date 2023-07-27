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
          <NuxtLink to="/">
            <NuxtImg
              class="easy-navbar__logo"
              src="/logos/easyliga.svg"
              quality="100"
              width="38"
              height="38"
              fit="contain"
            />
          </NuxtLink>
        </template>
        <template #item="props">
          <NavbarItem :item="props.item" />
        </template>
        <template #end>
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
