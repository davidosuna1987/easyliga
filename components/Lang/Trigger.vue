<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="easy-lang-trigger-component">
    <Icon :name="icon" size="2rem" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'LangTrigger',
}
</script>
