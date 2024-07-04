<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federation-edit-page">
      <FederationEdit />
    </div>
  </NuxtLayout>
</template>
