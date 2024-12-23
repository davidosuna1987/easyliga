<script setup lang="ts">
import { pricingPlans, PricingPlanTemporality } from '@/domain/pricing-plan'

const { t } = useI18n()
const emit = defineEmits()

const plans = ref([])
const interval = ref<PricingPlanTemporality>('month')
const activeItem = ref<number>(0)
const prevItem = ref<number>(0)
const nextItem = ref<number>(0)
const slides = ref<HTMLElement[]>([])
const containerHeight = ref<number>(0)
const moreInfoModalVisible = ref<boolean>(false)

const selectedPlan = computed(() => {
  return pricingPlans[activeItem.value]
})

const setItemRef = (slide: HTMLElement) => {
  if (slide) {
    if (containerHeight.value < slide.offsetHeight)
      containerHeight.value = slide.offsetHeight
    slides.value.push(slide)
  }
}

const slideClass = (index: number) => {
  if (index === prevItem.value) return 'is-prev'
  if (index === nextItem.value) return 'is-next'
  if (index === activeItem.value) return 'is-active'
  return 'is-hidden'
}

const slideTo = (index: number) => {
  if (!slides.value[index]) return
  activeItem.value = index
  prevItem.value = index - 1 < 0 ? slides.value.length - 1 : index - 1
  nextItem.value = index + 1 >= slides.value.length ? 0 : index + 1
}

const setInterval = (newInterval: PricingPlanTemporality) => {
  interval.value = newInterval
}

const slideNext = () => {
  slideTo(nextItem.value)
}

const slidePrev = () => {
  slideTo(prevItem.value)
}

watch(selectedPlan, val => {
  emit('selected', selectedPlan.value)
})

const init = async () => {
  slideTo(1)
}

onMounted(() => {
  init()
})

onBeforeUpdate(() => {
  slides.value = []
})
</script>

<template>
  <section
    class="easy-carousel-component"
    :style="{ height: `${containerHeight}px` }"
  >
    <div class="flex w-full justify-center align-items-center mb-6 fz-5">
      <Button
        class="p-button uppercase py-1 px-4"
        :class="{ 'p-button-text': interval === 'year' }"
        @click.prevent="setInterval('month')"
      >
        {{ t('pricing_plans.temporality.month') }}
      </Button>
      <span class="ml-3 is-muted"></span>
      <Button
        class="p-button uppercase py-1 px-4"
        :class="{ 'p-button-text': interval === 'month' }"
        @click.prevent="setInterval('year')"
      >
        {{ t('pricing_plans.temporality.year') }}
      </Button>
    </div>

    <nav class="arrows">
      <Icon name="mdi:chevron-left" class="arrow" @click.prevent="slidePrev" />
      <Icon name="mdi:chevron-right" class="arrow" @click.prevent="slideNext" />
    </nav>

    <article
      v-for="(plan, index) in pricingPlans"
      :key="index"
      :ref="setItemRef"
      class="easy-carousel"
      :class="[slideClass(index)]"
      :data-id="index"
      :data-index="index"
      @click.prevent="slideTo(index)"
      :style="{ minHeight: `${containerHeight}px` }"
    >
      <WebPricingCard
        :title="plan.title"
        :description="plan.description"
        :price="plan.pricing[interval]"
        :temporality="interval"
        :features="plan.features"
        :highlighted="plan.highlighted"
        @moreInfo="moreInfoModalVisible = true"
      />
    </article>

    <nav class="bullets">
      <span
        v-for="(_, index) in pricingPlans"
        :key="index"
        :class="['bullet', { 'is-active': index === activeItem }]"
        @click.prevent="slideTo(index)"
      ></span>
    </nav>

    <Dialog
      :draggable="false"
      v-model:visible="moreInfoModalVisible"
      modal
      position="bottom"
      :closable="false"
    >
      <template #header>
        <header class="be-support__header text-center w-full">
          <h3>{{ t('pricing_plans.conditions.title') }}</h3>
          <p>{{ t('pricing_plans.conditions.subtitle') }}</p>
        </header>
      </template>

      <div
        class="mt-5 mb-5 px-5"
        v-html="t('pricing_plans.card_more_info_list_html')"
      ></div>
      <footer class="text-center mt-10">
        <Button
          class="p-button mb-5 px-8"
          @click.prevent="moreInfoModalVisible = false"
          >{{ t('forms.im_agree') }}</Button
        >
      </footer>
    </Dialog>
  </section>
</template>

<style scoped lang="scss">
@import '@/assets/css/common/breakpoints.scss';

.easy-carousel-component {
  position: relative;
  max-width: $media-md;
  margin-inline: auto;

  .easy-carousel {
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
      opacity: 0;
      z-index: 1;
    }

    &.is-prev {
      transform: translateX(-75%) scale(0.9);
    }

    &.is-next {
      transform: translateX(-25%) scale(0.9);
    }

    &.is-hidden {
      transform: translateX(-50%) scale(0.9);
      opacity: 0;
    }
  }

  .arrows {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    max-width: 425px;
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
    bottom: -17.5%;
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
      align-items: center;
    }

    .easy-carousel {
      width: 80%;

      &.is-prev,
      &.is-next {
        opacity: 0.6;
      }
    }

    .arrows {
      max-width: none;
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
}

.easy-carousel-chips {
  white-space: nowrap;
  display: inline-flex;
  flex-wrap: nowrap;
  border-radius: 0.25rem;
  overflow: hidden;
}

.easy-carousel-chip {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  font-size: 0.85rem;

  &.whitelisted {
    background-color: var(--success-color);
    color: var(--darken-color);
    border-radius: 0.25rem;
  }

  &.plan {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    background-color: var(--primary-color);
    color: white;
  }

  &.interval {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    border: solid 1px var(--primary-color);
    color: var(--primary-color);
  }

  &.active {
    border-radius: 0.25rem;
    background-color: var(--success-color);
    color: var(--darken-color);
  }

  &.canceled {
    border-radius: 0.25rem;
    background-color: var(--danger-color);
    color: var(--darken-color);
  }
}
</style>

<script lang="ts">
export default {
  name: 'WebPricingCarousel',
}
</script>
