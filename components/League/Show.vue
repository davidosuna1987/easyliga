<script setup lang="ts">
import LeagueService from '@/services/league'
import { League, mapApiLeagueToLeague } from '@/domain/league'
import { formatDateTime } from '@/domain/utils'

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()
const leagueService = new LeagueService()

const league = ref<League>()
const showGenerateGamesDialogForm = ref<boolean>(false)
const loadingApi = ref<boolean>(true)

const getLeague = async () => {
  loadingApi.value = true

  const { data, error } = await leagueService.get(
    Number(route.params.leagueId),
    {
      with: 'games,teams.federation,category,gender',
    },
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    league.value = mapApiLeagueToLeague(data.value.data.league)
  }

  loadingApi.value = false
  showGenerateGamesDialogForm.value = false
}

const handleDialogShow = () => {
  if (league.value?.teams && league.value?.teams?.length < 2) {
    toast.error(t('games.matchdays.error_only_one_team'))
    return
  }
  showGenerateGamesDialogForm.value = true
}

const handleDialogHide = () => {
  showGenerateGamesDialogForm.value = false
}

onMounted(() => {
  getLeague()
})
</script>

<template>
  <div class="easy-league-show-component">
    <Loading v-if="loadingApi" />

    <template v-else-if="league">
      <header class="mb-8">
        <Heading class="mb-5" position="center">
          {{ league.name }}
        </Heading>
        <div class="flex justify-center gap-5 relative bottom-2">
          <Tag
            class="font-light border-solid border-primary text-primary bg-transparent border py-[5px] px-5 dark:border-teal-500 dark:text-teal-500 text-lg"
            :value="`${t(`categories.${league.category?.name}`)}`"
            rounded
          />
          <Tag
            :class="[
              'font-light border-solid border-primary bg-transparent border py-[5px] px-5 text-lg',
              {
                'border-blue-500 text-blue-500':
                  league.gender?.name === 'masculine',
                'border-fuchsia-400 text-fuchsia-400':
                  league.gender?.name === 'femenine',
                'border-yellow-500 text-yellow-500':
                  league.gender?.name === 'mixed',
              },
            ]"
            :value="`${t(`genders.${league.gender?.name}`)}`"
            rounded
          />
        </div>
      </header>

      <div class="flex flex-col sm:flex-row gap-8">
        <div class="teams">
          <Heading tag="h6" class="mb-2">{{ t('teams.team', 2) }}</Heading>
          <EasyGrid :gap="3">
            <div v-for="team in league.teams" class="card">
              <p>{{ team.name }}</p>
              <small class="opacity-60">{{ team.federation?.name }}</small>
            </div>
          </EasyGrid>
        </div>

        <EasyGrid v-if="league.matchdays?.length" class="matchdays" :gap="3">
          <template v-for="matchday in league.matchdays">
            <div v-if="matchday.matchday">
              <Heading tag="h6" class="mb-2">
                {{ t('games.matchdays.num', { num: matchday.matchday }) }}
              </Heading>
              <EasyGrid :breakpoints="{ md: 2, lg: 3, xl: 4 }" :gap="3">
                <div v-for="game in matchday.games" class="card">
                  <p>{{ game.name }}</p>
                  <small class="opacity-60">{{
                    formatDateTime(game.date)
                  }}</small>
                </div>
              </EasyGrid>
            </div>
          </template>
        </EasyGrid>

        <div v-else class="matchdays flex flex-col items-center gap-3">
          <p>{{ t('games.matchdays.not_generated') }}</p>
          <Button
            :label="t('games.matchdays.generate')"
            size="small"
            @click.prevent="handleDialogShow"
          />
        </div>
      </div>
    </template>

    <LeagueMatchdaysDialogForm
      v-if="league"
      :visible="showGenerateGamesDialogForm"
      :league="league"
      @hide="handleDialogHide"
      @matchdays:generated="getLeague"
    />
  </div>
</template>

<style scoped lang="scss">
@import 'assets/css/common/breakpoints';

.teams {
  width: 100%;
}

.card {
  border: solid 1px var(--input-border-color);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;

  &:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--primary-color-text);
  }
}

.matchdays {
  flex: 1;
}

@media (min-width: $media-sm) {
  .teams {
    width: 250px;
  }
}
</style>

<script lang="ts">
export default {
  name: 'LeagueShow',
}
</script>
