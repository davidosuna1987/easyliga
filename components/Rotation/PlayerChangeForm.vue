<script setup lang="ts">
import { ApiErrorObject } from '@/types/errors'
import { Game } from '@/domain/game'
import {
  Rotation,
  RotationPlayerChangeRequest,
  RotationUpdateRequest,
  mapApiRotationToRotation,
  mapRotationPlayerChangeRequestToRotationUpdateRequestPlayer,
  mapRotationUpdateRequestToApiRotationUpdateRequest,
} from '@/domain/rotation'
import RotationService from '@/services/rotation'

const route = useRoute()
const toast = useEasyToast()
const rotationService = new RotationService()

const game = ref<Game>()
const rotation = ref<Rotation>()
const initialRotation = ref<Rotation>()
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject>()

const form = ref<Rotation>()
const requestedPlayerChanges = ref<RotationPlayerChangeRequest[]>([])

const getRotation = async () => {
  loadingApi.value = true

  const { data, error } = await rotationService.get(
    Number(route.params.rotation_id),
    {
      with: 'game,call,players',
      set_appends: 'current_rotation',
      with_count: 'players',
    },
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    return
  }

  initialRotation.value = mapApiRotationToRotation(data.value.data.rotation)
  rotation.value = mapApiRotationToRotation(data.value.data.rotation)
  game.value = rotation.value.game
  form.value = rotation.value

  loadingApi.value = false
}

const setRotationCaptain = (profileId?: number) => {
  if (!rotation.value) return

  if (typeof profileId === 'undefined') {
    rotation.value.inCourtCaptainProfileId = 0
    return
  }

  rotation.value.inCourtCaptainProfileId = profileId
}

const setFormPlayerChanges = (playerChanges: RotationPlayerChangeRequest[]) => {
  if (!form.value) return

  const clonedInitialRotation = JSON.parse(
    JSON.stringify(initialRotation.value),
  )

  if (
    !form.value.players
      .map(p => p.inCourtProfileId)
      .includes(form.value.inCourtCaptainProfileId)
  ) {
    form.value.inCourtCaptainProfileId =
      clonedInitialRotation?.inCourtCaptainProfileId ?? 0
  }

  requestedPlayerChanges.value = playerChanges

  if (!playerChanges.length) {
    form.value.players = clonedInitialRotation?.players ?? []
    form.value.inCourtCaptainProfileId =
      clonedInitialRotation?.inCourtCaptainProfileId ?? 0
    return
  }

  form.value.players.forEach(player => {
    const playerChange = playerChanges.find(
      playerChange => playerChange.profileId === player.profileId,
    )

    if (playerChange) {
      player.replacementProfileId = playerChange.replacementProfileId
      player.inCourtProfileId = playerChange.inCourtProfileId
      player.libero = playerChange.libero
    }
  })
}

const handleSubmit = async () => {
  loadingApi.value = true

  if (!form.value) return

  if (!form.value.inCourtCaptainProfileId) {
    toast.error(useNuxtApp().$i18n.t('errors.assign_in_court_captain'))
    loadingApi.value = false
    return
  }

  const rotationUpdateRequest: RotationUpdateRequest = {
    inCourtCaptainProfileId: form.value.inCourtCaptainProfileId,
    players: requestedPlayerChanges.value.map(
      mapRotationPlayerChangeRequestToRotationUpdateRequestPlayer,
    ),
  }

  const { data, error } = await rotationService.update(
    Number(route.params.rotation_id),
    mapRotationUpdateRequestToApiRotationUpdateRequest(rotationUpdateRequest),
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    loadingApi.value = false
    return
  } else {
    toast.success(useNuxtApp().$i18n.t('rotations.player_change_requested'))
    navigateTo(`/coach`)
  }

  await getRotation()
}

onBeforeMount(getRotation)
</script>

<template>
  <Loading v-if="loadingApi" />

  <form
    class="easy-coach-rotation-player-change-form-component"
    @submit.prevent="handleSubmit"
  >
    <Heading tag="h5" position="center" class="mb-5">{{ game?.name }}</Heading>
    <CoachRotationCourt
      v-if="form && rotation && rotation.call"
      :call="rotation.call"
      :rotation="form"
      :initialRotation="initialRotation"
      :isInitialRotationAssignment="false"
      @change:players="setFormPlayerChanges"
      @update:captain="setRotationCaptain"
    />

    <footer class="flex justify-end items-center mt-8">
      <Button type="submit" :disabled="!requestedPlayerChanges.length">
        {{
          $t('rotations.request_player_change', requestedPlayerChanges.length)
        }}
      </Button>
    </footer>
  </form>
</template>

<script lang="ts">
export default {
  name: 'RotationPlayerChangeForm',
}
</script>
