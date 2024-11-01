<script setup lang="ts">
const props = defineProps({
  size: {
    type: String,
    default: '38px',
  },
  forceDark: {
    type: Boolean,
    default: false,
  },
  forceLight: {
    type: Boolean,
    default: false,
  },
  lowercase: {
    type: Boolean,
    default: false,
  },
  hideText: {
    type: Boolean,
    default: false,
  },
})

const styles = computed(() => {
  let styles: Record<string, string> = {
    height: props.size,
  }

  if (props.hideText) {
    styles = {
      ...styles,
      aspectRatio: '1 / 1',
      objectFit: 'cover',
      objectPosition: 'left',
    }
  }

  return styles
})

const lightClass = computed(() => {
  return props.forceLight === props.forceDark
    ? 'dark:hidden'
    : props.forceLight
    ? 'inline'
    : 'hidden'
})

const darkClass = computed(() => {
  return props.forceLight === props.forceDark
    ? 'hidden dark:inline'
    : props.forceDark
    ? 'inline'
    : 'hidden'
})

const logoType = computed(() => {
  return props.lowercase ? 'full' : 'long'
})
</script>

<template>
  <div class="easy-icon-easy-liga-full-component">
    <NuxtImg
      :class="lightClass"
      :src="`/logos/easyliga-${logoType}.svg`"
      quality="100"
      :style="styles"
      fit="contain"
    />
    <NuxtImg
      :class="darkClass"
      :src="`/logos/easyliga-${logoType}-dark.svg`"
      quality="100"
      :style="styles"
      fit="contain"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'IconEasyLigaFull',
}
</script>
