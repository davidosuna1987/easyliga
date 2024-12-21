<script setup lang="ts"></script>

<template>
  <main :class="['easy-main', $route.meta.mainClass]">
    <slot />
  </main>
</template>

<script lang="ts">
export default {
  name: 'EasyMain',
}
</script>
