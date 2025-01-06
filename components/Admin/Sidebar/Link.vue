<script setup lang="ts">
const props = defineProps({
  to: String,
})
</script>

<template>
  <NuxtLink class="easy-admin-sidebar-link-component" :to="to">
    <Button size="small" :outlined="$route.path !== to">
      <slot />
    </Button>
  </NuxtLink>
</template>

<style scoped lang="scss">
.easy-admin-sidebar-link-component {
  width: 100%;

  button {
    width: 100%;
    display: grid;
    place-content: center;
  }
}
</style>

<script lang="ts">
export default {
  name: 'AdminSidebarLink',
}
</script>
