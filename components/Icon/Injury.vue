<script setup lang="ts">
const props = defineProps({
  size: {
    type: String,
    default: '1.75rem',
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  gradient: {
    type: Boolean,
    default: false,
  },
})

const circleFill = computed(() => (props.gradient ? 'url(#X)' : '#FFFFFF'))
</script>

<template>
  <svg
    :class="[
      'easy-icon-injury-component rounded-full',
      { 'border border-black': props.bordered },
    ]"
    :height="size"
    :width="size"
    viewBox="0 0 300 300"
    xmlns="http://www.w3.org/2000/svg"
  >
    <radialGradient
      v-if="gradient"
      id="X"
      cx="149.833"
      cy="149.833"
      r="150"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="#FFFFFF" />
      <stop offset="0.4923" stop-color="#FDFDFD" />
      <stop offset="0.6696" stop-color="#F6F6F6" />
      <stop offset="0.796" stop-color="#EBEBEB" />
      <stop offset="0.898" stop-color="#DADADA" />
      <stop offset="0.9845" stop-color="#C4C4C4" />
      <stop offset="1" stop-color="#BFBFBF" />
    </radialGradient>
    <circle :fill="circleFill" cx="149.8" cy="149.8" r="150" />
    <rect fill="#CC0000" height="60" width="200" x="49.8" y="119.8" />
    <rect fill="#CC0000" height="200" width="60" x="119.8" y="49.8" />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'IconInjury',
}
</script>
