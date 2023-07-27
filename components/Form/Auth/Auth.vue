<script lang="ts" setup>
type FormLink = {
  label: string
  href: string
}

const props = defineProps({
  buttonLabel: {
    type: String,
    required: true,
  },
  link: {
    type: Object as PropType<FormLink>,
    default: null,
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
  name: 'FormAuth',
}
</script>
