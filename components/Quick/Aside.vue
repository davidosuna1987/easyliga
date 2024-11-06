<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <aside class="easy-quick-aside-component">
    <Heading
      class="mb-5 pb-2 [border-bottom:solid_1px_var(--text-color)]"
      tag="h6"
    >
      {{ title }}
    </Heading>
    <slot />
  </aside>
</template>

<script lang="ts">
export default {
  name: 'QuickAside',
}
</script>
