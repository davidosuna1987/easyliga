<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: 'var(--text-highlight-background)',
  },
  borderColor: {
    type: String,
    default: 'var(--text-highlight-background)',
  },
  textColor: {
    type: String,
    default: 'var(--text-color)',
  },
  width: {
    type: String,
    default: '115%',
  },
  height: {
    type: String,
    default: '100%',
  },
  left: {
    type: String,
    default: '-5%',
  },
  top: {
    type: String,
    default: '0',
  },
})
</script>

<template>
  <span
    class="easy-text-highlight-component relative inline-block w-fit"
    :style="{ color: props.textColor }"
  >
    <span class="relative z-10">
      <slot />
    </span>

    <EasyTextHighlightBackground
      :class="[`absolute z-0`]"
      :color="color"
      :borderColor="borderColor"
      :width="width"
      :height="height"
      :style="{
        left: props.left,
        top: props.top,
      }"
    />
  </span>
</template>

<script lang="ts">
export default {
  name: 'TextHighlight',
}
</script>
