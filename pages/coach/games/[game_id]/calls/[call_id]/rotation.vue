<script setup lang="ts">
import { Set } from '@/domain/set'

definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
})

const set = ref<Set>()
</script>

<template>
  <NuxtLayout name="default">
    <Heading tag="h3" position="center">{{
      $t('rotations.assign_set_rotation', { num: set?.number })
    }}</Heading>
    <CoachRotationForm initialRotation @update:set="set = $event" />
  </NuxtLayout>
</template>
