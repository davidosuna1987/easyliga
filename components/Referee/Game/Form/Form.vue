<script setup lang="ts">
import TeamService from '@/services/team'
import FederationService from '@/services/federation'
import SedeService from '@/services/sede'
import GameService from '@/services/game'
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiGameStoreRequest } from '@/types/api/game'
import { ApiErrorObject } from '@/types/errors'
import { Category, GameStorePreviewData } from '@/domain/game'
import {
  Federation,
  FederationScope,
  mapApiFederationToFederation,
} from '@/domain/federation'
import { Gender } from '@/domain/game'
import { Court } from '@/domain/court'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { League } from 'domain/league'

const emit = defineEmits<{
  (e: 'changed', value: GameStorePreviewData): void
}>()

const { t } = useI18n()
const auth = useAuthStore()
const toast = useEasyToast()

const teamService = new TeamService()
const federationService = new FederationService()
const sedeService = new SedeService()
const gameService = new GameService()

const selectedCategory = ref<Category>()
const selectedGender = ref<Gender>()
const selectedLeague = ref<League>()
const selectedLocalTeam = ref<Team>()
const selectedVisitorTeam = ref<Team>()
const selectedSede = ref<Sede>()
const selectedCourt = ref<Court>()

const loadingLeagues = ref<boolean>(false)
const loadingTeams = ref<boolean>(false)
const loadingCourts = ref<boolean>(false)
const loadingStore = ref<boolean>(false)

const groupedLeagues = ref<Federation[]>([])
const leagueTeams = ref<Team[]>([])
const groupedCourts = ref<Sede[]>([])

const localTeams = computed((): Team[] => leagueTeams.value)
const visitorTeams = computed((): Team[] =>
  leagueTeams.value.filter(team => team.id !== form.value.local_team_id),
)

const form = ref<ApiGameStoreRequest>({
  league_id: 0,
  court_id: 0,
  referee_id: auth.user?.id ?? 0,
  local_team_id: 0,
  visitor_team_id: 0,
  start: null,
  status: null,
})

const errors = ref<ApiErrorObject | null>(null)

const handleCategorySelected = (category: Category) => {
  selectedCategory.value = category
}

const handleGenderSelected = (gender: Gender) => {
  selectedGender.value = gender
}

const handleLeagueSelected = (league: League) => {
  selectedLeague.value = league
}

const handleLocalTeamSelected = (team: Team) => {
  selectedLocalTeam.value = team
}

const handleVisitorTeamSelected = (team: Team) => {
  selectedVisitorTeam.value = team
}

const handleCourtSelected = (court: Court) => {
  selectedSede.value = groupedCourts.value.find(
    sede => sede.id === court.sedeId,
  )
  selectedCourt.value = court
}

const submit = async () => {
  loadingStore.value = true
  const { data, error } = await gameService.store(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value.data?.errors
  } else {
    toast.success(t('games.created'))
    navigateTo(`/referee/games/${data.value?.data.game.id}/arbitrate`)
  }

  loadingStore.value = false
}

const getGroupedLeagues = async () => {
  if (!selectedCategory.value || !selectedGender.value) return

  loadingLeagues.value = true

  const { data } = await federationService.scopeWithLeagues(
    FederationScope.REGIONAL,
    {
      category_id: selectedCategory.value.id.toString(),
      gender_id: selectedGender.value.id.toString(),
      // with: 'leagues',
      // where_has: `leagues:category_id:${selectedCategory.value.id},leagues:gender_id:${selectedGender.value.id}`,
    },
  )
  groupedLeagues.value =
    data.value?.data.federations.map(mapApiFederationToFederation) ?? []
  loadingLeagues.value = false
}

watch(selectedCategory, async category => {
  if (category && selectedGender.value) {
    getGroupedLeagues()
  }
})

watch(selectedGender, async gender => {
  if (gender) {
    getGroupedLeagues()
  }
})

watch(selectedLeague, async league => {
  if (!league?.divisionId || !selectedCategory.value || !selectedGender.value)
    return

  loadingTeams.value = true
  const response = await teamService.fetch({
    where: `division_id:${league?.divisionId},category_id:${selectedCategory.value.id},gender_id:${selectedGender.value.id}`,
  })
  leagueTeams.value =
    response.data.value?.data.teams.map(team => mapApiTeamToTeam(team)) ?? []
  loadingTeams.value = false
})

watch(selectedLocalTeam, async team => {
  if (team && team.clubId) {
    loadingCourts.value = true
    const response = await sedeService.fetch({
      where_has: 'courts',
      where: `club_id:${team.clubId}`,
      with: 'courts',
    })
    groupedCourts.value =
      response.data.value?.data.sedes.map(mapApiSedeToSede) ?? []
    loadingCourts.value = false
  }
})

const onChangeData = computed((): GameStorePreviewData => {
  return {
    category: selectedCategory.value,
    gender: selectedGender.value,
    league: selectedLeague.value,
    localTeam: selectedLocalTeam.value,
    visitorTeam: selectedVisitorTeam.value,
    sede: selectedSede.value,
    court: selectedCourt.value,
  }
})

watch(onChangeData, data => {
  errors.value = null
  form.value.league_id = data.league?.id ?? 0
  form.value.court_id = data.court?.id ?? 0
  form.value.local_team_id = data.localTeam?.id ?? 0
  form.value.visitor_team_id = data.visitorTeam?.id ?? 0
  emit('changed', data)
})
</script>

<template>
  <form
    class="easy-game-form-component grid gap-x-2 gap-y-4"
    @submit.prevent="submit"
  >
    <EasyGrid
      :breakpoints="{ xs: 1, sm: 2, xl: 3 }"
      :gapX="2"
      :gapY="4"
      items="end"
    >
      <FormLabel :label="t('categories.category')">
        <CategorySelector @category:selected="handleCategorySelected" />
      </FormLabel>
      <FormLabel :label="t('genders.gender')">
        <GenderSelector
          :disabled="!selectedCategory"
          @gender:selected="handleGenderSelected"
        />
      </FormLabel>
      <FormLabel :label="t('leagues.league')" :error="errors?.league_id?.[0]">
        <FederationLeagueSelector
          :groupedLeagues="groupedLeagues"
          :categoryId="selectedCategory?.id"
          :genderId="selectedGender?.id"
          :disabled="!selectedGender || loadingLeagues"
          :loading="loadingLeagues"
          @league:selected="handleLeagueSelected"
        />
      </FormLabel>
      <FormLabel :label="t('teams.local')">
        <TeamSelector
          :disabled="!selectedLeague || loadingTeams"
          :teams="localTeams"
          :loading="loadingTeams"
          @selected="handleLocalTeamSelected"
        />
      </FormLabel>
      <FormLabel :label="t('teams.visitor')">
        <TeamSelector
          :disabled="!form.local_team_id || loadingTeams"
          :teams="visitorTeams"
          :loading="loadingTeams"
          @selected="handleVisitorTeamSelected"
        />
      </FormLabel>
      <FormLabel :label="t('courts.court')" :error="errors?.court_id?.[0]">
        <SedeCourtSelector
          :groupedCourts="groupedCourts"
          :disabled="!form.local_team_id"
          @court:selected="handleCourtSelected"
        />
      </FormLabel>
    </EasyGrid>
    <EasyGrid justify="end">
      <Button
        class="mt-3"
        type="submit"
        :label="t('games.create')"
        :loading="loadingStore"
      />
    </EasyGrid>
  </form>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameForm',
}
</script>
