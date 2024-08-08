<script setup lang="ts">
import { IconName, IconNames } from '@/domain/icon'

const props = defineProps({
  name: {
    type: String as PropType<IconName>,
    required: true,
  },
  size: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <Icon class="easy-icon-component" :name="IconNames[name]" :size="size" />
</template>

<script lang="ts">
export default {
  name: 'EasyIcon',
}
</script>
