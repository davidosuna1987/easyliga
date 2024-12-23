<script setup lang="ts">
import { Fragment } from 'vue'

const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  (e: 'change', value: number): void
}>()

const instance = getCurrentInstance()

const activeIndex = ref<number>(props.activeIndex)
const slides = ref<VNode[]>([])
const maxCardHeight = ref<number>(0)

const prevIndex = computed(() =>
  activeIndex.value === 0 ? slides.value.length - 1 : activeIndex.value - 1,
)
const nextIndex = computed(() =>
  // activeIndex.value + 1 >= slides.value.length ? 0 : index + 1
  activeIndex.value === slides.value.length - 1 ? 0 : activeIndex.value + 1,
)

const slideClass = (index: number) => {
  if (index === prevIndex.value) return 'is-prev'
  if (index === nextIndex.value) return 'is-next'
  if (index === activeIndex.value) return 'is-active'
  return 'is-hidden'
}

const slideTo = (index: number) => {
  if (!slides.value[index]) return
  activeIndex.value = index
  emit('change', index)
}

const slideNext = () => {
  slideTo(nextIndex.value)
}

const slidePrev = () => {
  slideTo(prevIndex.value)
}

const init = async () => {
  setCarouselSlides()
}

const setCarouselHeight = () => {
  setTimeout(() => {
    document.querySelectorAll('.easy-carousel-slide > *').forEach(slide => {
      if (maxCardHeight.value < slide.clientHeight) {
        maxCardHeight.value = slide.clientHeight
      }
    })
  }, 0)
}

const setCarouselSlides = () => {
  if (instance?.slots.default) {
    const nodes =
      instance.slots
        .default()
        ?.flatMap(node =>
          node.type === Fragment ? node.children || [] : [node],
        ) || []
    slides.value = nodes as VNode[]
  }

  setCarouselHeight()
  slideTo(activeIndex.value)
}

watch(
  () => props.activeIndex,
  value => {
    activeIndex.value = value
  },
)

onMounted(() => {
  init()
})

watchEffect(() => {
  setCarouselSlides()
})
</script>

<template>
  <div
    class="easy-carousel-component"
    :style="{ height: `${maxCardHeight}px` }"
  >
    <div
      v-for="(slide, index) in slides"
      :key="index"
      :class="['easy-carousel-slide', slideClass(index)]"
      :data-index="index"
      @click.prevent="slideTo(index)"
    >
      <slot :name="`slide-${index}`" />
      <component :is="slide" :style="{ height: `${maxCardHeight}px` }" />
    </div>

    <EasyCarouselNavigation
      :slides="slides"
      :activeIndex="activeIndex"
      @slide:next="slideNext"
      @slide:prev="slidePrev"
      @slide:to="slideTo"
    />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/common/breakpoints.scss';

.easy-carousel-component {
  position: relative;
  max-width: $media-md;
  margin-inline: auto;

  .easy-carousel-slide {
    position: absolute;
    background-color: var(--background-color);
    display: inline-block;
    transition: all 250ms ease-in-out;
    cursor: pointer;
    max-width: 425px;
    user-select: none;
    left: 50%;
    width: calc(100% - 8rem);
    overflow: hidden;

    &.is-active {
      position: absolute;
      transform: translateX(-50%);
      opacity: 1;
      z-index: 2;
    }

    &.is-prev,
    &.is-next {
      position: absolute;
      display: inline-block;
      opacity: 0.6;
      z-index: 1;
    }

    &.is-prev {
      transform: translateX(-60%) scale(0.9);
    }

    &.is-next {
      transform: translateX(-40%) scale(0.9);
    }

    &.is-hidden {
      transform: translateX(-50%) scale(0.9);
      opacity: 0;
    }
  }

  @media (min-width: $media-md) {
    .easy-carousel-slide {
      width: 80%;

      &.is-prev {
        transform: translateX(-75%) scale(0.9);
      }

      &.is-next {
        transform: translateX(-25%) scale(0.9);
      }
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'EasyCarousel',
}
</script>
