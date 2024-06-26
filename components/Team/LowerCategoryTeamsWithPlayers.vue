<script setup lang="ts">
import { Team, TeamMember, mapApiTeamToTeam } from '@/domain/team'
import TeamService from '@/services/team'
import { Player } from '@/domain/player'

const props = defineProps({
  teamId: {
    type: Number,
    required: true,
  },
  selectedPlayers: {
    type: Array as PropType<Player[]>,
    default: [],
  },
  togglePlayer: {
    type: Function as PropType<(player: Player) => void>,
    required: true,
  },
  setCaptain: {
    type: Function as PropType<(id: number) => void>,
    required: true,
  },
  setLibero: {
    type: Function as PropType<(id: number) => void>,
    required: true,
  },
  setShirtNumberUpdatePlayer: {
    type: Function as PropType<(player: Player | TeamMember) => void>,
    required: true,
  },
  setCaptainToggleDisabledProfileId: {
    type: Number,
    required: false,
  },
  tooltipsDisabled: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const teamService = new TeamService()

const lowerCategoryTeamsWithPlayers = ref<Team[]>([])
const loadingApi = ref<boolean>(false)

const getLowerCategoryTeamsWithPlayers = async () => {
  loadingApi.value = true
  const { data, error } = await teamService.lowerCategoryTeamsWithPlayers(
    props.teamId,
  )

  if (data.value) {
    lowerCategoryTeamsWithPlayers.value = data.value.data.teams.map(team =>
      mapApiTeamToTeam(team),
    )

    // lowerCategoryTeamsWithPlayers.value.forEach(team => {
    //   team.players?.forEach(player => {
    //     player.shirtNumber = 0
    //   })
    // })
  }

  loadingApi.value = false
}

getLowerCategoryTeamsWithPlayers()
</script>

<template>
  <LoadingLabel
    :label="t('teams.lower_category_teams_with_players.loading')"
    v-if="loadingApi"
  />
  <EasyGrid
    class="easy-team-lower-category-teams-with-players-component"
    :gap="5"
  >
    <div v-for="team in lowerCategoryTeamsWithPlayers">
      <Heading tag="h5">{{ team.name }}</Heading>
      <GameCallList
        v-if="team.players"
        :players="team.players"
        :selectedPlayers="selectedPlayers"
        :togglePlayer="togglePlayer"
        :setCaptain="setCaptain"
        :setLibero="setLibero"
        :setShirtNumberUpdatePlayer="setShirtNumberUpdatePlayer"
        :setCaptainToggleDisabledProfileId="setCaptainToggleDisabledProfileId"
        :tooltipsDisabled="tooltipsDisabled"
      />
    </div>
  </EasyGrid>
</template>

<script lang="ts">
export default {
  name: 'TeamLowerCategoryTeamsWithPlayers',
}
</script>
