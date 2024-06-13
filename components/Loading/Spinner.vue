<template>
  <div class="easy-spinner-component animate-spin"></div>
</template>

<style lang="scss">
.easy-spinner-component {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid var(--primary-color);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;

  @media (prefers-color-scheme: dark) {
    border-top-color: black;
  }
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>

<script lang="ts">
export default {
  name: 'LoadingSpinner',
}
</script>
