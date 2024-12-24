<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 5,
  },
  autoResize: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  full: {
    type: Boolean,
    default: true,
  },
  maxLength: {
    type: Number,
    required: false,
  },
  maxHeight: {
    type: Number,
    default: 400,
  },
  showError: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const maxLengthExceeded = ref<boolean>(false)

const updateModelValue = (e: Event) =>
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
</script>

<template>
  <div
    :class="[
      'easy-textarea-component',
      'flex flex-col gap-1',
      full ? 'w-full' : 'inline-flex min-w-[300px]',
    ]"
    :style="{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }"
  >
    <Textarea
      :value="modelValue"
      :rows="5"
      :readonly="readonly"
      :disabled="disabled"
      :autoResize="autoResize"
      @input="updateModelValue"
    />
    <EasyCharacterCount
      v-if="maxLength"
      :class="[
        'self-end mt-1 text-xs',
        { 'opacity-50': !!showError && !maxLengthExceeded },
      ]"
      :count="modelValue.length"
      :max="maxLength"
      @maxLength:exceeded="maxLengthExceeded = $event"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'EasyTextarea',
}
</script>
