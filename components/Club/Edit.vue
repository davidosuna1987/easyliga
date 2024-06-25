<script lang="ts" setup>
import { Club, mapApiClubToClub } from '@/domain/club'
import ClubService from '@/services/club'

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()
const clubService = new ClubService()

const club = ref<Club>()
const loadingApi = ref<boolean>(false)

const getClub = async () => {
  loadingApi.value = true

  const { data, error } = await clubService.get(Number(route.params.clubId), {
    with: 'federation,responsible.profile,sedes.address,sedes.responsible.profile,address,licenses',
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    club.value = mapApiClubToClub(data.value.data.club)
  }

  loadingApi.value = false
}

const setInitialClubClub = async () => {
  await getClub()
}

onMounted(setInitialClubClub)
</script>

<template>
  <div class="easy-club-edit-component">
    <Loading v-if="loadingApi" />
    <template v-else-if="club">
      <Heading tag="h3" class="mb-5">
        {{ t('clubs.edit') }}
      </Heading>
      <ClubForm
        :club="club"
        @refresh="setInitialClubClub"
        @updated="setInitialClubClub"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ClubEdit',
}
</script>
