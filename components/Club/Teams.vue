<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import ClubService from '@/services/club'
import { Club, mapApiClubToClub } from '@/domain/club'
import { Sede } from '@/domain/sede'
import { Team } from '@/domain/team'

const auth = useAuthStore()
const storage = useEasyStorage()
const clubService = new ClubService()

const clubs = ref<Club[]>()
const loadingApi = ref<boolean>(false)

const getAuthuserClubWithSedesAndTeams = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await clubService.fetch({
    where: `responsible_id:${auth.user.id}`,
    with: 'sedes.teams.category,sedes.teams.gender,sedes.teams.players',
  })

  clubs.value = data.value?.data.clubs.map(mapApiClubToClub)

  loadingApi.value = false
}

const clubsWithTeams = computed(() => {
  return clubs.value?.filter(club =>
    club.sedes?.some(sede => sede.teams?.length),
  )
})

const clubManagesAnyTeam = computed(() => !!clubsWithTeams.value?.length)

const sedeContainsTeams = (sede: Sede) => !!sede.teams?.length

const goToEditTeam = (team: Team) => {
  storage.set(`team.${team.id}.edit`, team)
  navigateTo(`/club/teams/${team.id}/edit`)
}

onBeforeMount(getAuthuserClubWithSedesAndTeams)
</script>

<template>
  <div class="easy-club-teams-component">
    <Loading v-if="loadingApi" />
    <template v-else>
      <div v-if="clubManagesAnyTeam" class="grid grid-gap-2">
        <div class="club" v-for="club in clubsWithTeams">
          <Heading tag="h5">{{ club.name }}</Heading>
          <template v-for="sede in club.sedes">
            <div
              v-if="sedeContainsTeams(sede)"
              class="sede grid grid-gap-2 mt-3"
            >
              <Heading tag="h6">{{ sede.name }}</Heading>
              <div v-for="team in sede.teams" class="team mt-2 p-3 rounded-lg">
                <div class="team-info flex items-center">
                  <p>{{ team.name }}</p>
                  <Tag
                    class="px-3 font-light ml-2"
                    :value="`${$t(`categories.${team.category?.name}`)} ${$t(
                      `genders.${team.gender?.name}`,
                    )}`"
                    rounded
                  ></Tag>
                </div>
                <div
                  v-if="team.players"
                  class="team-actions flex items-center justify-between sm:justify-end"
                >
                  <small class="mr-3">
                    {{
                      $t(
                        'players.count',
                        { num: team.players?.length },
                        team.players?.length,
                      )
                    }}
                  </small>
                  <Button
                    :label="$t('forms.edit')"
                    size="small"
                    class="action"
                    @click.prevent="goToEditTeam(team)"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <p v-else class="text-center">{{ $t('clubs.no_managed_teams') }}</p>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ClubTeams',
}
</script>
