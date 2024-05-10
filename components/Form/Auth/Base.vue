<script lang="ts" setup>
const props = defineProps({
  buttonLabel: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <form class="easy-form-component" @submit.prevent="$emit('submitted')">
    <slot />

    <slot name="link" />

    <Button
      class="mt-3"
      type="submit"
      :label="buttonLabel"
      :loading="loading"
      :disabled="loading"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'FormAuthBase',
}
</script>
