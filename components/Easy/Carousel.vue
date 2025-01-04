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
const containerHeight = ref<number>(0)

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
      if (containerHeight.value < slide.clientHeight) {
        containerHeight.value = slide.clientHeight
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

  slideTo(activeIndex.value)
  setCarouselHeight()
}

watch(
  () => props.activeIndex,
  value => {
    activeIndex.value = value
  },
)

watchEffect(() => {
  setCarouselSlides()
})

onMounted(() => {
  init()
})
</script>

<template>
  <div
    class="easy-carousel-component"
    :style="{ height: `${containerHeight}px` }"
  >
    <div
      v-for="(slide, index) in slides"
      :key="index"
      :class="['easy-carousel-slide', slideClass(index)]"
      :data-index="index"
      :style="{ minHeight: `${containerHeight}px` }"
      @click.prevent="slideTo(index)"
    >
      <slot :name="`slide-${index}`" />
      <component :is="slide" />
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
    display: inline-flex;
    transition: all 250ms ease-in-out;
    cursor: pointer;
    max-width: 425px;
    user-select: none;
    left: 50%;
    width: calc(100% - 8rem);

    &.is-active {
      position: absolute;
      transform: translateX(-50%);
      opacity: 1;
      z-index: 2;
    }

    &.is-prev,
    &.is-next {
      position: absolute;
      opacity: 0.6;
      z-index: 1;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(var(--background-color-rgb), 0.5);
        z-index: 1;
      }
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
