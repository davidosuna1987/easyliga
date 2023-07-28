<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="easy-lang-icon-component">
    <Icon :name="icon" :size="size" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'LangIcon',
}
</script>
