<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
})

useEasyHead('pages.coach.game.team.rotation.player-change.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <Heading tag="h3" position="center">
      {{ t('rotations.player_change', 2) }}
    </Heading>
    <RotationPlayerChangeForm />
  </NuxtLayout>
</template>
