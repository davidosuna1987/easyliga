<script setup lang="ts"></script>

<template>
  <div class="easy-web-landing-component">
    <WebLandingSectionDetails />
    <WebLandingSectionFeatures />

    <section class="landing-pricing mt-20">
      <WebPricingPlans />
    </section>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WebLanding',
}
</script>
