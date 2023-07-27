<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'

const props = defineProps({
  item: {
    type: Object as PropType<MenuItem>,
    required: true,
  },
})
</script>

<template>
  <NuxtLink
    :to="item.to"
    class="easy-navbar__link p-menuitem-link"
    @click="item.command"
  >
    {{ item.label }}
  </NuxtLink>
</template>

<script lang="ts">
export default {
  name: 'NavbarItem',
}
</script>
