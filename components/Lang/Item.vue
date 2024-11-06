<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import { getLangIcon } from '@/domain/locale'

const props = defineProps({
  item: {
    type: Object as PropType<MenuItem>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-lang-item-component flex items-center">
    <LangIcon :icon="getLangIcon(item.code)" size="1.25rem" /> {{ item.name }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'LangItem',
}
</script>
