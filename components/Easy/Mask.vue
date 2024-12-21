<script setup lang="ts">
import { getMaskStyles } from '@/domain/mask'

const props = defineProps({
  mask: {
    type: Number,
    default: 1,
  },
  src: {
    type: String,
    default: '/images/landing/anime-style-background-landscape.jpeg',
  },
  width: {
    type: String,
    default: '100%',
  },
})

const maskStyles = getMaskStyles(props.mask)

const maskStyle = computed(() => ({
  maskSize: 'cover',
  maskPosition: 'center',
  maskRepeat: 'no-repeat',
  width: props.width,
  overflow: 'hidden',

  ...maskStyles,
}))

const imgStyle = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}))
</script>

<template>
  <div class="easy-mask-component" :style="maskStyle">
    <NuxtImg :src="src" :style="imgStyle" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'EasyMask',
}
</script>
