<script setup lang="ts">
import { FeatureId, getFeature } from '@/domain/feature'

const props = defineProps({
  id: {
    type: String as PropType<FeatureId>,
    required: true,
  },
  colorful: {
    type: Boolean,
    default: false,
  },
  colorfulLight: {
    type: Boolean,
    default: false,
  },
  colorfulDark: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const { isLightMode, isDarkMode } = useTheme()

const feature = getFeature(props.id)

const isColorfulLight = computed(() => props.colorfulLight && isLightMode.value)
const isColorfulDark = computed(() => props.colorfulDark && isDarkMode.value)

const isColorful = computed(
  () => props.colorful || isColorfulLight.value || isColorfulDark.value,
)

const styles = computed(() => ({
  backgroundColor: isColorful.value ? feature?.background : undefined,
  color: isColorful.value ? feature?.color ?? 'black' : undefined,
}))
</script>

<template>
  <article
    v-if="feature"
    :class="[
      'easy-web-landing-feature-card-component rounded-lg',
      feature?.number ? 'p-6 pb-10' : 'background-card relative h-[370px]',
      ,
      {
        // 'has-border': feature.id !== 'image',
        // 'shadow-lg': true,
      },
    ]"
    :style="styles"
  >
    <template v-if="feature?.number">
      <div class="flex items-center gap-4 mb-8">
        <EasyTextHighlight
          class="top-0 left-0"
          color="white"
          borderColor="white"
          top="0"
        >
          <h2
            class="text-3xl font-bold rounded-full w-16 h-20 grid place-content-center text-black"
          >
            {{ feature?.number }}
          </h2>
        </EasyTextHighlight>
        <h3 class="text-3xl font-semibold">{{ t(`features.${id}.title`) }}</h3>
      </div>
      <p class="mt-2 text-xl">{{ t(`features.${id}.description`) }}</p>

      <slot />
    </template>
    <NuxtImg
      v-else
      class="absolute bottom-0 right-0 max-w-[364px] w-full"
      src="/images/landing/anime-style-medium-shot-of-a-volleyball-player-ball.png"
      quality="100"
      fit="contain"
    />
  </article>
</template>

<style scoped>
.background-card {
  background-image: url('/images/landing/anime-style-background-landscape.jpeg');
  background-size: cover;
  background-position: center;
}
</style>

<script lang="ts">
export default {
  name: 'WebLandingFeatureCard',
}
</script>
