<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
})
</script>

<template>
  <NuxtLayout name="default">
    <Heading tag="h3" position="center">
      {{ $t('rotations.player_change', 2) }}
    </Heading>
    <RotationPlayerChangeForm />
  </NuxtLayout>
</template>
