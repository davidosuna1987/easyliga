<script setup lang="ts">
import { Team, TeamMember, mapApiTeamToTeam } from '@/domain/team'
import TeamService from '@/services/team'
import { Player } from '@/domain/player'
import { getListTagColor } from '@/domain/list'

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
const toast = useEasyToast()

const teamService = new TeamService()

const lowerCategoryTeamsWithPlayers = ref<Team[]>([])
const loadingApi = ref<boolean>(false)

const getLowerCategoryTeamsWithPlayers = async () => {
  loadingApi.value = true
  const { data, error } = await teamService.lowerCategoryTeamsWithPlayers(
    props.teamId,
    {
      with: 'category,gender',
    },
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
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
    v-else
    class="easy-team-lower-category-teams-with-players-component"
    :gap="5"
  >
    <div
      v-if="lowerCategoryTeamsWithPlayers.length"
      v-for="team in lowerCategoryTeamsWithPlayers"
    >
      <header class="flex items-center gap-3">
        <Heading tag="h5">{{ team.name }}</Heading>
        <ListTag
          :label="`${t(`categories.${team.category?.name}`)}`"
          color="primary"
        />
        <ListTag
          :label="`${t(`genders.${team.gender?.name}`)}`"
          :color="getListTagColor(team.gender?.name)"
        />
      </header>
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
    <p v-else>{{ t('teams.lower_category_teams_with_players.not_found') }}</p>
  </EasyGrid>
</template>

<script lang="ts">
export default {
  name: 'TeamLowerCategoryTeamsWithPlayers',
}
</script>
