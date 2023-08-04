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
import { ApiSede, ApiSedeWithCourts } from '@/types/api/sede'
import { ApiErrorObject } from '@/types/errors'
import { ApiCategory } from '@/types/api/category'
import { ApiGender } from '@/types/api/gender'
import { ApiCourt } from 'types/api/court'
import { GameStorePreviewData } from '@/types/game'

const auth = useAuthStore()
const toast = useEasyToast()
const emit = defineEmits(['changed'])
const teamService = new TeamService()
const federationService = new FederationService()
const sedeService = new SedeService()
const gameService = new GameService()

const selectedCategory = ref<ApiCategory | null>(null)
const selectedGender = ref<ApiGender | null>(null)
const selectedLeague = ref<ApiLeague | null>(null)
const selectedLocalTeam = ref<ApiTeam | null>(null)
const selectedVisitorTeam = ref<ApiTeam | null>(null)
const selectedSede = ref<ApiSede | null>(null)
const selectedCourt = ref<ApiCourt | null>(null)

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

const setCategory = (category: ApiCategory) => {
  selectedCategory.value = category
}

const setGender = (gender: ApiGender) => {
  selectedGender.value = gender
}

const setLeague = (league: ApiLeague) => {
  selectedLeague.value = league
}

const setLocalTeam = (team: ApiTeam) => {
  selectedLocalTeam.value = team
}

const setVisitorTeam = (team: ApiTeam) => {
  selectedVisitorTeam.value = team
}

const setSedeAndCourt = ({
  sede,
  court,
}: {
  sede: ApiSede | null
  court: ApiCourt | null
}) => {
  selectedSede.value = sede
  selectedCourt.value = court
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
    navigateTo(`/referee/games/${data.value?.data.game.id}`)
  }
}

const getGroupedLeagues = async () => {
  if (!selectedCategory.value || !selectedGender.value) return

  loadingLeagues.value = true

  const response = await federationService.scope('national', {
    with: 'leagues',
    where_has: `leagues:category_id:${selectedCategory.value.id},leagues:gender_id:${selectedGender.value.id}`,
  })
  groupedLeagues.value = response.data.value?.data
    .federations as ApiFederationWithLeagues[]
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
  emit('changed', data)
})
</script>

<template>
  <form
    class="easy-game-form-component grid gap-x-2 gap-y-4"
    @submit.prevent="submit"
  >
    <div
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-4 items-end"
    >
      <FormLabel :label="$t('categories.category')">
        <CategorySelector @selected="setCategory" />
      </FormLabel>
      <FormLabel :label="$t('genders.gender')">
        <GenderSelector :disabled="!selectedCategory" @selected="setGender" />
      </FormLabel>
      <FormLabel :label="$t('leagues.league')" :error="errors?.league_id?.[0]">
        <FederationLeagueSelector
          :grouped-leagues="groupedLeagues"
          :disabled="!selectedGender || loadingLeagues"
          :loading="loadingLeagues"
          @selected="setLeague"
        />
      </FormLabel>
      <FormLabel :label="$t('teams.local')">
        <TeamSelector
          :disabled="!selectedLeague || loadingTeams"
          :teams="localTeams"
          :loading="loadingTeams"
          @selected="setLocalTeam"
        />
      </FormLabel>
      <FormLabel :label="$t('teams.visitor')">
        <TeamSelector
          :disabled="!form.local_team_id || loadingTeams"
          :teams="visitorTeams"
          :loading="loadingTeams"
          @selected="setVisitorTeam"
        />
      </FormLabel>
      <FormLabel :label="$t('courts.court')" :error="errors?.court_id?.[0]">
        <SedeCourtSelector
          :disabled="!form.local_team_id"
          @selected="setSedeAndCourt"
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
