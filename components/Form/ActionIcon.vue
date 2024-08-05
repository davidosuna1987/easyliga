<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    default: 16,
  },
  icon: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'primary',
  },
  outlined: {
    type: Boolean,
    default: true,
  },
})

const typeToColor = computed(() => {
  switch (props.type) {
    case 'text-danger':
      return '[var(--text-danger)]'
    default:
      return props.type
  }
})
</script>

<template>
  <div
    :class="[
      `easy-form-action-icon-component cursor-pointer p-1 rounded-full`,
      outlined
        ? `${
            props.type === 'text-danger'
              ? 'border-solid border-1'
              : `border-${typeToColor}-1`
          } text-${typeToColor} hover:bg-${typeToColor}`
        : `border-${typeToColor}-1 bg-${typeToColor} hover:bg-${typeToColor}-dark`,
    ]"
  >
    <Icon :name="icon" :size="String(size)" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FormActionIcon',
}
</script>
