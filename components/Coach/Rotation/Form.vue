<script setup lang="ts">
import CallService from '@/services/call'
import SetService from '@/services/set'
import RotationService from '@/services/rotation'
import { Call, mapApiCallToCall } from '@/domain/call'
import { Set, mapApiSetToSet } from '@/domain/set'
import { ApiRotationStoreRequest } from '@/types/api/rotation'
import {
  RotationPlayer,
  mapRotationPlayerToApiRotationPlayer,
} from '@/domain/rotation'

const emit = defineEmits(['update:set'])

const route = useRoute()
const toast = useEasyToast()
const callService = new CallService()
const setService = new SetService()
const rotationService = new RotationService()

const gameSets = ref<Set[]>([])
const call = ref<Call>()
const loadingApi = ref<boolean>(false)

const form = ref<ApiRotationStoreRequest>()

const currentSet = computed(() => gameSets.value[gameSets.value.length - 1])

const currentSetRotation = computed(() =>
  currentSet.value?.rotations?.find(
    rotation => rotation.callId === call.value?.id,
  ),
)

const currentSetHasRotation = computed(() =>
  currentSetRotation.value ? true : false,
)

const createInitialRotation = () => {
  if (!call.value || !currentSet.value) return
  form.value = {
    call_id: call.value.id,
    set_id: currentSet.value.id,
    number: 1,
    players: [],
  }
}

const getInitialData = async () => {
  loadingApi.value = true
  await Promise.all([getGameSets(), getCall()])
  createInitialRotation()
  loadingApi.value = false
}

const getGameSets = async () => {
  const { data } = await setService.fetch({
    where: `game_id:${route.params.game_id}`,
    with: 'rotations.players',
  })

  gameSets.value = data.value?.data.sets.map(mapApiSetToSet) ?? []
}

const getCall = async () => {
  const { data } = await callService.get(Number(route.params.call_id))

  if (data.value?.data.call) {
    call.value = mapApiCallToCall(data.value?.data.call)
  }
}

const setRotationPlayers = (players: RotationPlayer[]) => {
  if (!form.value) return
  form.value.players = players.map(mapRotationPlayerToApiRotationPlayer)
}

const handleSubmit = async () => {
  if (!form.value) return

  loadingApi.value = true

  const { data, error } = await rotationService.store(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else {
    toast.success(useNuxtApp().$i18n.t('rotations.assign_success'))
    navigateTo(`/coach`)
  }
}

watch(currentSet, () => emit('update:set', currentSet.value))

watch(currentSetRotation, () => {
  if (currentSetRotation.value?.players) {
    setRotationPlayers(currentSetRotation.value?.players)
  }
})

onBeforeMount(() => {
  getInitialData()
})
</script>

<template>
  <div class="easy-coach-rotation-form-component">
    <Loading v-if="loadingApi" />

    <Message v-if="currentSetHasRotation" :closable="false">{{
      $t('rotations.created_warning')
    }}</Message>

    <template v-if="call?.locked">
      <p v-if="!currentSetHasRotation" class="text-center mb-8">
        {{ $t('rotations.assign_howto') }}
      </p>
      <form @submit.prevent="handleSubmit">
        <CoachRotationCourt
          :call="call"
          :rotation="currentSetRotation"
          @update:players="setRotationPlayers"
        />

        <div
          v-if="!currentSetRotation?.players?.length"
          class="grid place-content-center mt-8"
        >
          <Button
            type="submit"
            class="easy-coach-rotation-court-component__button"
            :disabled="!form || form.players.length < 6"
          >
            {{ $t('rotations.assign') }}
          </Button>
        </div>
      </form>
    </template>
    <template v-else>
      <p class="text-center mb-8">
        {{ $t('rotations.assign_call') }}
      </p>
      <div class="grid place-content-center">
        <CoachButtonCall
          v-if="call"
          :gameId="call.gameId"
          :teamId="call.teamId"
          :locked="call.locked"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachRotationForm',
}
</script>
