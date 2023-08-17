<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import GameService from '@/services/game'
import { Game, mapApiGameToGame } from '@/domain/game'

definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})

const auth = useAuthStore()
const gameService = new GameService()

const currentGames = ref<Game[]>()
const loadingApi = ref<boolean>(false)

const getCurrentGames = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await gameService.fetch({
    where: `referee_id:${auth.user.id},status:!=:finished`,
  })

  currentGames.value = data.value?.data.games.map(game =>
    mapApiGameToGame(game),
  )

  loadingApi.value = false
}

onBeforeMount(getCurrentGames)
</script>

<template>
  <NuxtLayout name="default">
    <div
      class="easy-referee-page flex flex-col"
      :class="{ 'justify-between': !loadingApi && !currentGames?.length }"
    >
      <Heading class="mb-5" position="center">
        {{
          auth.profile?.first_name
            ? $t('referees.welcome', { name: auth.profile.first_name })
            : $t('referees.welcome_no_name')
        }}
      </Heading>
      <LoadingLabel
        v-if="loadingApi"
        size="1.25rem"
        :label="$t('games.loading', 2)"
        class="flex justify-center"
      />
      <template v-else>
        <RefereeCurrentGames
          v-if="currentGames?.length"
          :games="currentGames"
        />
        <div v-else class="content">
          <RefereeGameCreateButton />
        </div>
      </template>
    </div>
  </NuxtLayout>
</template>

<script lang="ts">
export default {
  name: 'RefereePage',
}
</script>
