<script lang="ts" setup>
const props = defineProps({
  buttonLabel: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <form class="easy-form-component" @submit.prevent="$emit('submitted')">
    <slot />

    <slot name="link" />

    <Button class="mt-3" type="submit" :label="buttonLabel" />
  </form>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'FormAuthBase',
}
</script>
