<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: 'h1',
  },
  highlighted: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <Heading
    :class="`easy-web-hero-title-component${
      props.highlighted ? ' highlighted' : ''
    }`"
    :tag="tag"
    :style="size ? { fontSize: size } : {}"
    center
  >
    <slot />
    <EasyTextHighlightBackground
      v-if="highlighted"
      class="absolute inset-0 top-2 -z-10"
      color="white"
    />
  </Heading>
</template>

<style scoped lang="scss">
@import '@/assets/css/common/breakpoints.scss';

.easy-web-hero-title-component {
  position: relative;
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 2.25rem;
  line-height: 2.5rem;
  text-shadow: var(--stroke-shadow);

  &.highlighted {
    display: inline-block;
    width: fit-content;
    margin-inline: auto;
    padding-inline: 4rem;
    padding-block: 0.25rem;
    color: var(--seagreen-color);
  }

  @media (min-width: $media-md) {
    font-size: 3.75rem;
    line-height: 1;
  }
}
</style>

<script lang="ts">
export default {
  name: 'WebHeroTitle',
}
</script>
