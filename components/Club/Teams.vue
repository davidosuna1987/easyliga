<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import ClubService from '@/services/club'
import { Club, mapApiClubToClub } from '@/domain/club'
import { Sede } from '@/domain/sede'
import { Team } from '@/domain/team'

const props = defineProps({
  loadingLabel: {
    type: String,
    required: false,
  },
})

const { t } = useI18n()
const auth = useAuthStore()
// const easyProps = useEasyProps()
const clubService = new ClubService()

const clubs = ref<Club[]>()
const loadingApi = ref<boolean>(false)

const getAuthuserClubWithSedesAndTeams = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await clubService.fetch({
    where: `responsible_id:${auth.user.id}`,
    with: 'sedes.teams.division,sedes.teams.category,sedes.teams.gender,sedes.teams.players',
  })

  if (data.value) {
    clubs.value = data.value.data.clubs.map(mapApiClubToClub)
  }

  loadingApi.value = false
}

const clubsWithTeams = computed(() => {
  return clubs.value?.filter(club =>
    club.sedes?.some(sede => sede.teams?.length),
  )
})

const clubManagesAnyTeam = computed(() => !!clubsWithTeams.value?.length)

const sedeContainsTeams = (sede: Sede) => !!sede.teams?.length

const goToEditClub = (club: Club) => {
  navigateTo(`/clubs/${club.id}/edit`)
}

const goToEditClubTeam = (club: Club, team: Team) => {
  // easyProps.set(`clubs.${club.id}.teams.${team.id}.edit`, { club, team })
  navigateTo(`/clubs/${club.id}/teams/${team.id}/edit`)
}

const goToCreateClubTeam = (club: Club) => {
  // easyProps.set(`clubs.${club.id}.teams.${team.id}.edit`, { club, team })
  navigateTo(`/clubs/${club.id}/teams/create`)
}

onMounted(getAuthuserClubWithSedesAndTeams)
</script>

<template>
  <div class="easy-club-teams-component">
    <template v-if="loadingApi">
      <LoadingLabel v-if="props.loadingLabel" :label="props.loadingLabel" />
      <Loading v-else />
    </template>
    <template v-else>
      <EasyGrid v-if="clubManagesAnyTeam">
        <div class="club" v-for="club in clubsWithTeams">
          <header class="header flex justify-between">
            <Heading tag="h5" class="club__name">{{ club.name }}</Heading>
            <Button
              :label="t('clubs.edit')"
              size="small"
              class="action"
              @click.prevent="goToEditClub(club)"
            />
          </header>
          <template v-for="sede in club.sedes">
            <EasyGrid v-if="sedeContainsTeams(sede)" class="sede mt-3">
              <Heading tag="h6">{{ sede.name }}</Heading>
              <div
                v-for="team in sede.teams"
                class="team p-3 rounded-lg"
                @click.prevent="goToEditClubTeam(club, team)"
              >
                <div class="team-info flex items-center gap-2">
                  <p>{{ team.name }}</p>
                  <Tag
                    class="font-light border-solid border-primary text-primary bg-transparent border py-[2px] px-2 dark:border-teal-500 dark:text-teal-500"
                    :value="`${t(`categories.${team.category?.name}`)}`"
                    rounded
                  />
                  <Tag
                    :class="[
                      'font-light border-solid border-primary bg-transparent text-primary border py-[2px] px-2',
                      {
                        'dark:border-blue-500 dark:text-blue-500':
                          team.gender?.name === 'masculine',
                        'dark:border-fuchsia-400 dark:text-fuchsia-400':
                          team.gender?.name === 'femenine',
                        'dark:border-yellow-500 dark:text-yellow-500':
                          team.gender?.name === 'mixed',
                      },
                    ]"
                    :value="`${t(`genders.${team.gender?.name}`)}`"
                    rounded
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
                  <Button
                    :label="t('forms.edit')"
                    size="small"
                    class="action"
                    @click.prevent="goToEditClubTeam(club, team)"
                  />
                </div>
              </div>
            </EasyGrid>
          </template>

          <div class="flex justify-end mt-3">
            <Button
              :label="t('teams.add')"
              size="small"
              class="action"
              @click.prevent="goToCreateClubTeam(club)"
            />
          </div>
        </div>
      </EasyGrid>
      <p v-else class="text-center">{{ t('clubs.no_managed_teams') }}</p>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ClubTeams',
}
</script>
