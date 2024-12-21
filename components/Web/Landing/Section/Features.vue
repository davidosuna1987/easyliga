<script setup lang="ts">
import { features } from '@/domain/feature'
</script>

<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <WebLandingFeatureCard
      v-for="(feature, index) in features"
      :id="feature.id"
      :class="{
        'order-1 sm:order-2 lg:order-3': feature.id === 'image',
        'order-2': feature.id === 'reports',
        'order-3': feature.id === 'calls',
        'order-4': feature.id === 'calendar',
        'order-5': feature.id === 'classification',
        'order-6': feature.id === 'club',
      }"
      colorfulLight
    />
  </section>
</template>

<script lang="ts">
export default {
  name: 'WebLandingSectionFeatures',
}
</script>
