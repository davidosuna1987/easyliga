<script setup lang="ts"></script>

<template>
  <div class="easy-web-landing-component">
    <WebLandingSectionDetails />
    <WebLandingSectionFeatures />

    <section class="landing-pricing mt-20">
      <WebPricingPlans />
    </section>

    <section class="landing-ready full-section bg-[#1f2937] -mb-8 md:-mb-16">
      <WebLandingSectionReady />
    </section>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WebLanding',
}
</script>
