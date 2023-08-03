<script lang="ts" setup>
import { GameStorePreviewData } from '@/types/game'

definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})

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
      <FormLabel strong :label="$t('categories.category')" class="mb-3">
        <p :class="{ 'opacity-50': !game.category }">
          {{
            game.category?.name
              ? $t(`categories.${game.category.name}`)
              : $t('categories.select')
          }}
        </p>
      </FormLabel>
      <FormLabel strong :label="$t('genders.gender')" class="mb-3">
        <p :class="{ 'opacity-50': !game.gender }">
          {{
            game.gender?.name
              ? $t(`genders.${game.gender.name}`)
              : $t('genders.select')
          }}
        </p>
      </FormLabel>
      <FormLabel strong :label="$t('leagues.league')" class="mb-3">
        <p :class="{ 'opacity-50': !game.league }">
          {{ game.league?.name ?? $t('leagues.select') }}
        </p>
      </FormLabel>
      <FormLabel strong :label="$t('teams.local')" class="mb-3">
        <p :class="{ 'opacity-50': !game.localTeam }">
          {{ game.localTeam?.name ?? $t('teams.select') }}
        </p>
      </FormLabel>
      <FormLabel strong :label="$t('teams.visitor')" class="mb-3">
        <p :class="{ 'opacity-50': !game.visitorTeam }">
          {{ game.visitorTeam?.name ?? $t('teams.select') }}
        </p>
      </FormLabel>
      <FormLabel strong :label="$t('forms.place')" class="mb-3">
        <p :class="{ 'opacity-50': !game.sede }">
          {{ game.sede?.name ?? $t('courts.select') }}
        </p>
      </FormLabel>
      <FormLabel strong :label="$t('courts.court')" class="mb-3">
        <p :class="{ 'opacity-50': !game.court }">
          {{ game.court?.name ?? $t('courts.select') }}
        </p>
      </FormLabel>
    </template>
    <div class="easy-games-create-page">
      <Heading class="mb-5" position="center">{{ $t('games.create') }}</Heading>
      <GameForm @changed="setGame" />
    </div>
  </NuxtLayout>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'GamesCreatePage',
}
</script>
