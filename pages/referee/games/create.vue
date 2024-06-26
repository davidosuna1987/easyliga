<script lang="ts" setup>
import { GameStorePreviewData } from '@/domain/game'

definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})

const { t } = useI18n()

const game = ref(<GameStorePreviewData>{
  category: null,
  gender: undefined,
  league: null,
  localTeam: null,
  visitorTeam: null,
  sede: null,
  court: null,
})

const handleGameChanged = (data: GameStorePreviewData) => {
  game.value = data
}
</script>

<template>
  <NuxtLayout name="sidebar-left">
    <template #sidebar>
      <RefereeGameFormSidebar :game="game" />
    </template>
    <div class="easy-referee-game-create-page">
      <Heading class="mb-5" position="center">{{ t('games.create') }}</Heading>
      <RefereeGameForm @changed="handleGameChanged" />
    </div>
  </NuxtLayout>
</template>
