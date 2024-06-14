<template>
  <EasyGrid class="easy-loading-component" center>
    <LoadingSpinner />
  </EasyGrid>
</template>

<style lang="scss">
.easy-loading-component {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);

  @media (prefers-color-scheme: dark) {
    background-color: rgba(25, 25, 25, 0.5);
  }
}
</style>

<script lang="ts">
export default {
  name: 'Loading',
}
</script>
