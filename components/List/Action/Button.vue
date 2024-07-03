<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: false,
  },
  onClick: {
    type: Function,
    required: false,
  },
})

const handleOnClick = () => {
  if (!props.onClick) return
  props.onClick()
}
</script>

<template>
  <Button
    class="easy-list-action-button-component"
    :label="label"
    size="small"
    @click.prevent="handleOnClick"
  />
</template>

<style scoped>
.easy-list-action-button-component {
  padding-block: 0.25rem;
}
</style>

<script lang="ts">
export default {
  name: 'ListActionButton',
}
</script>
