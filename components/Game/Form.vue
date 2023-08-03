<script setup lang="ts">
import TeamService from '@/services/team'
import FederationService from '@/services/federation'
import SedeService from '@/services/sede'
import GameService from '@/services/game'
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiGameStoreRequest } from '@/types/api/game'
import { ApiLeague } from '@/types/api/league'
import { ApiTeam } from '@/types/api/team'
import { ApiFederationWithLeagues } from '@/types/api/federation'
import { ApiSedeWithCourts } from '@/types/api/sede'
import { ApiErrorObject } from '@/types/errors'

const auth = useAuthStore()
const toast = useEasyToast()
const teamService = new TeamService()
const federationService = new FederationService()
const sedeService = new SedeService()
const gameService = new GameService()

const selectedCategoryId = ref<number | null>(null)
const selectedGenderId = ref<number | null>(null)
const selectedLeague = ref<ApiLeague | null>(null)
const selectedLocalTeam = ref<ApiTeam | null>(null)

const loadingLeagues = ref<boolean>(false)
const loadingTeams = ref<boolean>(false)
const loadingCourts = ref<boolean>(false)
const loadingStore = ref<boolean>(false)

const groupedLeagues = ref<ApiFederationWithLeagues[]>([])
const leagueTeams = ref<ApiTeam[]>([])
const groupedCourts = ref<ApiSedeWithCourts[]>([])

const localTeams = computed((): ApiTeam[] => leagueTeams.value)
const visitorTeams = computed((): ApiTeam[] =>
  leagueTeams.value.filter(team => team.id !== form.value.local_team_id),
)

const form = ref<ApiGameStoreRequest>({
  league_id: null,
  court_id: null,
  referee_id: auth.user?.id ?? null,
  local_team_id: null,
  visitor_team_id: null,
})

const errors = ref<ApiErrorObject | null>(null)

const setCategory = (categoryId: number) => {
  selectedCategoryId.value = categoryId
}

const setGender = (genderId: number) => {
  selectedGenderId.value = genderId
}

const setLeague = (league: ApiLeague) => {
  selectedLeague.value = league
}

const setLocalTeam = (team: ApiTeam) => {
  selectedLocalTeam.value = team
}

const submit = async () => {
  loadingStore.value = true
  const { data, error } = await gameService.store(form.value)

  if (error.value) {
    if (error.value.data?.errors instanceof Array) {
      toast.error(error.value.data?.errors[0])
    } else {
      loadingStore.value = false
      toast.correctErrors()
    }
    errors.value = error.value.data?.errors
  } else {
    toast.success(useNuxtApp().$i18n.t('games.created'))
    navigateTo(`/games/${data.value?.data.game.id}`)
  }
}

const getGroupedLeagues = async () => {
  loadingLeagues.value = true

  const response = await federationService.scope('national', {
    with: 'leagues',
    where_has: `leagues:category_id:${selectedCategoryId.value},leagues:gender_id:${selectedGenderId.value}`,
  })
  groupedLeagues.value = response.data.value?.data
    .federations as ApiFederationWithLeagues[]
  loadingLeagues.value = false
}

watch(selectedCategoryId, async categoryId => {
  if (categoryId && selectedGenderId.value) {
    getGroupedLeagues()
  }
})

watch(selectedGenderId, async genderId => {
  if (genderId) {
    getGroupedLeagues()
  }
})

watch(selectedLeague, async league => {
  form.value.league_id = league?.id ?? null

  if (league) {
    loadingTeams.value = true
    const response = await teamService.fetch({
      where: `division_id:${league?.division_id}`,
    })
    leagueTeams.value = response.data.value?.data.teams as ApiTeam[]
    loadingTeams.value = false
  }
})

watch(selectedLocalTeam, async team => {
  form.value.local_team_id = team?.id ?? null

  if (team && team.club_id) {
    loadingCourts.value = true
    const response = await sedeService.fetch({
      where_has: 'courts',
      where: `club_id:${team.club_id}`,
      with: 'courts',
    })
    groupedCourts.value = response.data.value?.data.sedes as ApiSedeWithCourts[]
    loadingCourts.value = false
  }
})
</script>

<template>
  <form class="easy-game-form-component grid gap-2" @submit.prevent="submit">
    <div class="grid md:grid-cols-3 gap-2 items-end">
      <FormLabel :label="$t('categories.category')">
        <CategorySelector @selected="setCategory" />
      </FormLabel>
      <FormLabel :label="$t('genders.gender')">
        <GenderSelector :disabled="!selectedCategoryId" @selected="setGender" />
      </FormLabel>
      <FormLabel :label="$t('leagues.league')" :error="errors?.league_id?.[0]">
        <FederationLeagueSelector
          :grouped-leagues="groupedLeagues"
          :disabled="!selectedGenderId || loadingLeagues"
          :loading="loadingLeagues"
          @selected="setLeague"
        />
      </FormLabel>
    </div>
    <div class="grid md:grid-cols-3 gap-2 items-end mt-2">
      <FormLabel :label="$t('teams.team')">
        <TeamSelector
          :disabled="!selectedLeague || loadingTeams"
          :teams="localTeams"
          :loading="loadingTeams"
          @selected="setLocalTeam"
        />
      </FormLabel>
      <FormLabel :label="$t('teams.team')">
        <TeamSelector
          :disabled="!form.local_team_id || loadingTeams"
          :teams="visitorTeams"
          :loading="loadingTeams"
          @selected="team => (form.visitor_team_id = team.id)"
        />
      </FormLabel>
      <FormLabel :label="$t('courts.court')" :error="errors?.court_id?.[0]">
        <SedeCourtSelector
          :disabled="!form.local_team_id"
          @selected="court => (form.court_id = court.id)"
        />
      </FormLabel>
    </div>
    <div class="grid justify-end">
      <Button
        class="mt-3"
        type="submit"
        :label="$t('games.create')"
        :loading="loadingStore"
      />
    </div>
  </form>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'GameForm',
}
</script>
