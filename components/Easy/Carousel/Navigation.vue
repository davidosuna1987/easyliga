<script setup lang="ts">
const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
  activeIndex: {
    type: Number,
    required: true,
  },
  showArrows: {
    type: Boolean,
    default: true,
  },
  showBullets: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'slide:prev'): void
  (e: 'slide:next'): void
  (e: 'slide:to', value: number): void
}>()
</script>

<template>
  <nav v-if="showArrows" class="arrows">
    <Icon
      name="mdi:chevron-left"
      class="arrow"
      @click.prevent="emit('slide:prev')"
    />
    <Icon
      name="mdi:chevron-right"
      class="arrow"
      @click.prevent="emit('slide:next')"
    />
  </nav>

  <nav v-if="showBullets" class="bullets">
    <span
      v-for="(_, index) in slides"
      :key="index"
      :class="['bullet', { 'is-active': index === activeIndex }]"
      @click.prevent="emit('slide:to', index)"
    ></span>
  </nav>
</template>

<style scoped lang="scss">
@import '@/assets/css/common/breakpoints.scss';

.arrows {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  max-width: 550px;
  margin: auto;

  .arrow {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    opacity: 0.5;
    font-size: 4.5rem;
    cursor: pointer;
    z-index: 3;

    &:first-child {
      left: -10px;
    }

    &:last-child {
      right: -10px;
    }

    &:hover {
      opacity: 1;
      color: var(--primary-color);
    }
  }
}

.bullets {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  position: absolute;
  bottom: -3rem;
  width: 100%;
  z-index: 10;

  .bullet {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    cursor: pointer;
    border: solid 1px var(--text-color);

    &.is-active {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }
}

@media (min-width: $media-md) {
  .arrows {
    max-width: none;
    align-items: center;
  }

  .arrow {
    &:first-child {
      right: auto;
      left: -20px;
    }

    &:last-child {
      left: auto;
      right: -20px;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'EasyCarouselNavigation',
}
</script>
