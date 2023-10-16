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
import {
  ApiEvents,
  ApiRotationLockToggledEventResponse,
} from '@/types/api/event'

const app = useNuxtApp()
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

  window.Echo.leaveAllChannels()
  listenRotationLockToggledEvent(game.value?.id, rotation.value.id)

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
  if (!form.value) return

  if (form.value.locked) {
    toast.warn(app.$i18n.t('rotations.locked_warning'))
    return
  }

  if (!form.value.inCourtCaptainProfileId) {
    toast.error(app.$i18n.t('errors.assign_in_court_captain'))
    return
  }
  loadingApi.value = true

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
    toast.success(app.$i18n.t('rotations.player_change_requested'))
    navigateTo(`/coach`)
  }

  await getRotation()
}

const listenRotationLockToggledEvent = (
  gameId?: number,
  rotationId?: number,
) => {
  if (!gameId || !rotationId) return

  window.Echo.channel(
    `game.${gameId}.rotation.${rotationId}.lock-toggled`,
  ).listen(
    ApiEvents.ROTATION_LOCK_TOGGLED,
    (response: ApiRotationLockToggledEventResponse) => {
      toast.info(
        response.rotation.locked
          ? app.$i18n.t('events.rotation_locked')
          : app.$i18n.t('events.rotation_unlocked'),
      )
      getRotation()
    },
  )
}

// INFO: replaced with window.Echo.leaveAllChannels()
// const leaveRotationLockToggledEvent = (gameId: number, rotationId: number) => {
//   window.Echo.leaveChannel(`game.${gameId}.rotation.${rotationId}.lock-toggled`)
// }

onBeforeMount(getRotation)
</script>

<template>
  <Loading v-if="loadingApi" />

  <form
    class="easy-coach-rotation-player-change-form-component"
    @submit.prevent="handleSubmit"
  >
    <Heading tag="h5" position="center" class="mb-5">{{ game?.name }}</Heading>

    <Message v-if="rotation?.locked" :closable="false">{{
      $t('rotations.locked_warning')
    }}</Message>

    <div
      class="form-lockable-section"
      :class="{ 'is-locked': rotation?.locked }"
    >
      <CoachRotationCourt
        v-if="form && rotation && rotation.call"
        :call="rotation.call"
        :rotation="form"
        :initialRotation="initialRotation"
        :isInitialRotationAssignment="false"
        @change:players="setFormPlayerChanges"
        @update:captain="setRotationCaptain"
      />

      <footer class="flex justify-end items-center mt-24 md:mt-8">
        <Button
          type="submit"
          :disabled="!requestedPlayerChanges.length"
          :label="
            form?.locked
              ? $t('rotations.locked')
              : $t('rotations.player_change', requestedPlayerChanges.length)
          "
        />
      </footer>
    </div>
  </form>
</template>

<style scoped lang="scss">
.form-lockable-section {
  &.is-locked {
    pointer-events: none !important;
    filter: grayscale(1);
  }
}
</style>

<script lang="ts">
export default {
  name: 'RotationPlayerChangeForm',
}
</script>
