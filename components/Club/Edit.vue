<script lang="ts" setup>
import ClubService from '@/services/club'
import { useAuthStore } from '@/stores/useAuthStore'
import { Club, mapApiClubToClub } from '@/domain/club'

const { t } = useI18n()
const route = useRoute()
const auth = useAuthStore()
const toast = useEasyToast()
const clubService = new ClubService()

const club = ref<Club>()
const loadingApi = ref<boolean>(false)

const authUserCanManageClub = (club: Club) =>
  auth.hasAnyRole(['admin', 'staff']) ||
  (auth.hasRole('club') && auth.user && auth.user.id === club.responsibleId)

const getClub = async () => {
  loadingApi.value = true

  const { data, error } = await clubService.get(Number(route.params.clubId), {
    with: 'federation,responsible.profile,sedes.address,sedes.responsible.profile,address,licenses',
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    const mappedClub = mapApiClubToClub(data.value.data.club)

    if (authUserCanManageClub(mappedClub)) {
      club.value = mappedClub
    } else {
      toast.error(t('clubs.not_allowed_to_manage'))
      navigateTo('/club')
    }
  }

  loadingApi.value = false
}

onMounted(getClub)
</script>

<template>
  <div class="easy-club-edit-component">
    <Loading v-if="loadingApi" />
    <template v-else-if="club">
      <div class="flex items-center justify-between">
        <Heading tag="h3" class="mb-5">{{ t('clubs.edit') }}</Heading>
        <Button
          :label="t('teams.add')"
          size="small"
          outlined
          :onClick="
            () => navigateTo(`/club/${route.params.clubId}/team/create`)
          "
        />
      </div>
      <ClubForm :club="club" @refresh="getClub" @updated="getClub" />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ClubEdit',
}
</script>
