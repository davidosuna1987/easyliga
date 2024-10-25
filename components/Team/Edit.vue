<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import TeamService from '@/services/team'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useEasyToast()
const easyProps = useEasyProps()

const teamService = new TeamService()

const team = ref<Team>()
const loadingApi = ref<boolean>(false)

const getTeam = async () => {
  loadingApi.value = true

  const { data, error } = await teamService.get(Number(route.params.teamId), {
    with: 'division,category,gender,sedes,coach.profile,substituteCoaches.profile,players.address,licenses',
    set_appends: 'responsible_ids,editor_ids',
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    if (!data.value.data.team) {
      toast.error(t('teams.not_found'))
      redirectUser()
      return
    }

    team.value = mapApiTeamToTeam(data.value.data.team, true)

    if (!auth.user) {
      toast.error(t('teams.not_allowed_to_edit', { teamName: team.value.name }))
      redirectUser()
      return
    }

    if (
      !team.value.editorIds?.includes(auth.user.id) &&
      !auth.hasAnyRole(['admin', 'staff'])
    ) {
      toast.error(t('teams.not_allowed_to_edit', { teamName: team.value.name }))
      redirectUser()
      return
    }
  }

  loadingApi.value = false
}

const redirectUser = () => {
  if (auth.hasRole('club')) {
    navigateTo('/club')
  } else if (auth.hasRole('coach')) {
    navigateTo('/coach')
  } else {
    navigateTo('/')
  }
}

const isResponsible = computed(() => {
  if (!auth.user) return false

  return (
    !!auth.isAdmin() ||
    !!auth.isStaff() ||
    !!team.value?.responsibleIds?.includes(auth.user.id)
  )
})

const setInitialClubTeam = async () => {
  // const easyData = easyProps.get(
  //   `clubs.${route.params.clubId}.teams.${route.params.teamId}.edit`,
  //   false,
  // )

  // if (easyData.club) {
  //   club.value = easyData.club as Club
  // }

  // if (easyData.team) {
  //   team.value = easyData.team as Team
  // }

  await getTeam()
}

onMounted(setInitialClubTeam)
</script>

<template>
  <div class="easy-team-edit-component">
    <Loading v-if="loadingApi" />
    <template v-else-if="team">
      <Heading tag="h3" class="mb-5">
        {{ t('teams.edit_name', { teamName: team.name }) }}
      </Heading>
      <TeamForm
        :sedes="team.sedes ?? []"
        :team="team"
        :isResponsible="isResponsible"
        @refresh="setInitialClubTeam"
        @team:updated="setInitialClubTeam"
      />
    </template>
    <p v-else class="text-center">{{ t('teams.not_found') }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TeamEdit',
}
</script>
