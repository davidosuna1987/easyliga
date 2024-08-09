<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import GameService from '@/services/game'
import { Game, mapApiGameToGame } from '@/domain/game'
import { formatDate } from '@/domain/utils'

const { t } = useI18n()
const auth = useAuthStore()
const gameService = new GameService()

const currentGames = ref<Game[]>()
const loadingApi = ref<boolean>(false)

const getGamesByDate = async (date: Date | string = new Date()) => {
  if (!auth.user) return

  loadingApi.value = true

  date = new Date(date)
  const formatedDate = formatDate(date.toString(), '-', true)
  const formatedDateLeft = `${formatedDate} 00:00:00`
  const formatedDateRight = `${formatedDate} 23:59:59`

  const { data } = await gameService.fetch({
    where: `referee_id:${auth.user.id},status:!=:finished,date:>=:${formatedDateLeft},date:<=:${formatedDateRight}`,
  })

  currentGames.value = data.value?.data.games.map(game =>
    mapApiGameToGame(game),
  )

  loadingApi.value = false
}

onMounted(getGamesByDate)
</script>

<template>
  <EasyGrid class="easy-referee-panel-component">
    <Heading class="mb-5" position="center">
      {{
        auth.profile?.firstName
          ? t('referees.welcome', { name: auth.profile.firstName })
          : t('referees.welcome_no_name')
      }}
    </Heading>

    <EasyGrid class="mb-8" justify="center">
      <EasyCalendar @date:changed="getGamesByDate" />
    </EasyGrid>

    <LoadingLabel
      v-if="loadingApi"
      size="1.25rem"
      :label="t('games.loading', 2)"
      class="flex justify-center"
    />
    <template v-else>
      <RefereeGames v-if="currentGames?.length" :games="currentGames" />
      <p v-else class="text-center">{{ t('games.no_games_for_date') }}</p>
      <!-- <div v-else class="content">
        <RefereeGameCreateButton />
      </div> -->
    </template>
  </EasyGrid>
</template>

<script lang="ts">
export default {
  name: 'RefereePanel',
}
</script>
