<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { getListTagColor } from '@/domain/list'

const props = defineProps({
  loadingLabel: {
    type: String,
    required: false,
  },
})

const { t } = useI18n()
const auth = useAuthStore()

const teams = ref<Team[]>()
const loadingApi = ref<boolean>(false)

const getCoachedTeams = async () => {
  if (!auth.user) return

  loadingApi.value = true

  const { data } = await auth.coachedTeams({
    where: `responsible_id:${auth.user.id}`,
    with: 'division,category,gender,players',
  })

  if (data.value) {
    teams.value = data.value.data.teams.map(apiTeam =>
      mapApiTeamToTeam(apiTeam, true),
    )
  }

  loadingApi.value = false
}

const goToEditClubTeam = (team: Team) =>
  navigateTo(`/club/${team.clubId}/team/${team.id}/edit`)

onMounted(getCoachedTeams)
</script>

<template>
  <div class="easy-coach-team-list-component">
    <template v-if="loadingApi">
      <LoadingLabel v-if="props.loadingLabel" :label="props.loadingLabel" />
      <Loading v-else />
    </template>
    <template v-else>
      <Heading tag="h3" class="mb-5">
        {{ t('teams.coached') }}
      </Heading>

      <EasyGrid v-if="teams?.length">
        <template v-for="team in teams">
          <EasyGrid class="sede mt-3">
            <div class="team p-3 rounded-lg">
              <div class="team-info flex items-center gap-2">
                <p>{{ team.name }}</p>
                <ListTag
                  :label="`${t(`categories.${team.category?.name}`)}`"
                  color="primary"
                />
                <ListTag
                  :label="`${t(`genders.${team.gender?.name}`)}`"
                  :color="getListTagColor(team.gender?.name)"
                />
              </div>
              <div
                class="team-actions flex items-center justify-between sm:justify-end"
              >
                <small class="mr-3">
                  {{
                    t(
                      'players.count',
                      { num: team.players?.length ?? 0 },
                      team.players?.length ?? 0,
                    )
                  }}
                </small>
                <ListActionButton
                  :label="t('forms.edit')"
                  severity="info"
                  outlined
                  @click="goToEditClubTeam(team)"
                />
              </div>
            </div>
          </EasyGrid>
        </template>
      </EasyGrid>
      <p v-else class="text-center">{{ t('teams.no_coached_teams') }}</p>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachTeamList',
}
</script>
