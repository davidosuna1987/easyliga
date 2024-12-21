<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    default: 400,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  backgroundSize: {
    type: String,
    default: '200%',
  },
  hasOpacity: {
    type: Boolean,
    default: true,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
  isHeroSection: {
    type: Boolean,
    default: false,
  },
})

const wrapperRef = ref<HTMLElement>()

const componentStyles = computed(() => ({
  height: `${props.size}px`,
  inset: 0,
  zIndex: -1,
  width: '100%',
  // width: '110%',
  borderTopLeftRadius: props.isHeroSection ? 'var(--border-radius)' : 0,
  borderTopRightRadius: props.isHeroSection ? 'var(--border-radius)' : 0,
}))

const wrapperStyles = {
  height: `${props.size}px`,
  // height: `calc(${props.size}px + 10%)`,
  backgroundImage: `url(${props.imageUrl ?? '/images/background.svg'})`,
  backgroundSize: props.backgroundSize,
}

const handleMouseMove = (event: MouseEvent | TouchEvent) => {
  if (!props.interactive || !wrapperRef.value) return

  const { clientX, clientY } = 'touches' in event ? event.touches[0] : event
  const width = window.innerWidth / 5
  const height = window.innerHeight / 5
  const moveX = clientX / width
  const moveY = clientY / height

  wrapperRef.value.style.setProperty('--background-position-x', `${moveX}%`)
  wrapperRef.value.style.setProperty('--background-position-y', `${moveY}%`)

  // wrapperRef.value.style.transform = `translate3d(-${moveX}%, -${moveY}%, 0)`
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchstart', handleMouseMove)
  window.addEventListener('touchmove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchstart', handleMouseMove)
  window.removeEventListener('touchmove', handleMouseMove)
})
</script>

<template>
  <div
    class="easy-animated-background-component"
    :style="{
      ...componentStyles,
      position: props.isHeroSection ? 'absolute' : 'relative',
    }"
  >
    <div
      id="animated-background-content"
      :class="['wrapper', { 'has-opacity': props.hasOpacity }]"
      ref="wrapperRef"
      :style="wrapperStyles"
    >
      <div
        :class="[
          'w-full h-full relative z-10',
          isHeroSection && 'flex flex-col justify-center',
        ]"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.easy-animated-background-component {
  overflow: hidden;

  .wrapper {
    --background-position-x: 0;
    --background-position-y: 0;

    position: relative;
    width: 100%;

    background-repeat: no-repeat;
    background-position: top var(--background-position-x) right
      var(--background-position-y);
    transition: background-position 50ms, transform 50ms, translate 50ms;

    &.has-opacity::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--background-color);
      opacity: 0.8;
      z-index: 1;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'EasyAnimatedBackground',
}
</script>
