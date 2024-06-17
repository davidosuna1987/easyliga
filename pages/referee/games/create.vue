<script lang="ts" setup>
import { GameStorePreviewData } from '@/types/game'

definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})

const { t } = useI18n()

const game = ref(<GameStorePreviewData>{
  category: null,
  gender: null,
  league: null,
  localTeam: null,
  visitorTeam: null,
  sede: null,
  court: null,
})

const setGame = (data: GameStorePreviewData) => {
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
      <RefereeGameForm @changed="setGame" />
    </div>
  </NuxtLayout>
</template>
