<script setup lang="ts">
import { Call, CallPlayerData } from '@/domain/call'
import { RotationPlayer } from '@/domain/rotation'
import { Rotation } from '@/domain/rotation'
import { Player, getFullName } from '@/domain/player'

const props = defineProps({
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
  rotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  initialRotation: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:players', 'update:captain'])

const toast = useEasyToast()

const rotationPlayers = ref<RotationPlayer[]>([])
const selectedPosition = ref<number | null>(null)
const selectedRotationInCourtCaptain = ref<RotationPlayer>()
const showCaptainSelector = ref(false)

const availablePlayers = computed(() =>
  props.call.playersData.filter(
    player =>
      !rotationPlayers.value.map(p => p.profileId).includes(player.profileId),
  ),
)

const selectableCaptainPlayers = computed(() =>
  props.call.playersData.filter(
    player =>
      // player.captain &&
      rotationPlayers.value
        .map(rp => rp.profileId)
        .includes(player.profileId) &&
      player.profileId !== selectedRotationInCourtCaptain.value?.profileId,
  ),
)

const selectedCaptain = computed(() =>
  props.call.playersData.find(
    player =>
      player.profileId === selectedRotationInCourtCaptain.value?.profileId,
  ),
)

const playerToReplace = computed(() => {
  const rotationPlayer = rotationPlayers.value.find(
    rp => rp.position === selectedPosition.value,
  )
  return props.call.playersData.find(
    p => p.profileId === rotationPlayer?.profileId,
  )
})

const setRotationCaptain = (player: Player) => {
  selectedRotationInCourtCaptain.value = rotationPlayers.value.find(
    rp => rp.profileId === player.profileId,
  )

  showCaptainSelector.value = false
}

const addOrReplaceRotationPlayer = (player: CallPlayerData) => {
  if (!selectedPosition.value) return
  if (!!props.rotation?.players) return

  if (!!props.initialRotation && !!player.libero) {
    toast.warn(
      useNuxtApp().$i18n.t('rotations.libero_not_allowed_in_initial_rotation'),
    )
    return
  }

  const existingPlayer = rotationPlayers.value.find(
    rp => rp.position === selectedPosition.value,
  )

  if (existingPlayer) {
    if (
      selectedRotationInCourtCaptain.value?.profileId ===
      existingPlayer.profileId
    ) {
      selectedRotationInCourtCaptain.value = undefined
    }

    rotationPlayers.value = rotationPlayers.value.filter(
      rp => rp.position !== selectedPosition.value,
    )
  }

  rotationPlayers.value.push({
    profileId: player.profileId,
    rotationId: 0,
    replacementProfileId: null,
    inCourtProfileId: player.profileId,
    position: selectedPosition.value,
    libero: false,
  })

  if (!selectedRotationInCourtCaptain.value) {
    selectedRotationInCourtCaptain.value = rotationPlayers.value.find(
      rp => player.captain && rp.profileId === player.profileId,
    )
  }

  selectedPosition.value = null
}

const getRotationPlayer = (position: number): CallPlayerData | undefined => {
  const playerData = props.call.playersData.find(
    p =>
      p.profileId ===
      rotationPlayers.value.find(rp => rp.position === position)?.profileId,
  )

  return playerData
}

const isCaptainInCourtPlayerAtPosition = (position: number): boolean => {
  const player = getRotationPlayer(position)
  if (!player || !selectedRotationInCourtCaptain.value) return false

  return (
    selectedRotationInCourtCaptain.value.profileId === player.profileId ?? false
  )
}

watch(rotationPlayers, newVal => emit('update:players', newVal), {
  deep: true,
})

watch(
  () => selectedRotationInCourtCaptain.value,
  newVal => emit('update:captain', newVal),
  {
    immediate: true,
  },
)

watch(
  () => props.rotation,
  () => {
    if (props.rotation?.players) {
      rotationPlayers.value = props.rotation.players

      selectedRotationInCourtCaptain.value = props.rotation.players.find(
        rp => rp.profileId === props.rotation?.inCourtCaptainProfileId,
      )
    }
  },
)
</script>

<template>
  <div class="easy-game-court-component easy-coach-rotation-court-component">
    <div class="wrapper">
      <div class="court" :class="{ 'is-disabled': !!props.rotation?.players }">
        <div class="side left">
          <div class="position-1" @click="selectedPosition = 1">
            <span v-if="getRotationPlayer(1)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(1)?.shirtNumber"
                size="lg"
              />
              <IconCaptain
                v-if="isCaptainInCourtPlayerAtPosition(1)"
                size="sm"
              />
            </span>
            <span v-else class="placeholder">1</span>
          </div>
          <div class="position-2" @click="selectedPosition = 2">
            <span v-if="getRotationPlayer(2)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(2)?.shirtNumber"
                size="lg"
              />
              <IconCaptain
                v-if="isCaptainInCourtPlayerAtPosition(2)"
                size="sm"
              />
            </span>
            <span v-else class="placeholder">2</span>
          </div>
          <div class="position-3" @click="selectedPosition = 3">
            <span v-if="getRotationPlayer(3)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(3)?.shirtNumber"
                size="lg"
              />
              <IconCaptain
                v-if="isCaptainInCourtPlayerAtPosition(3)"
                size="sm"
              />
            </span>
            <span v-else class="placeholder">3</span>
          </div>
          <div class="position-4" @click="selectedPosition = 4">
            <span v-if="getRotationPlayer(4)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(4)?.shirtNumber"
                size="lg"
              />
              <IconCaptain
                v-if="isCaptainInCourtPlayerAtPosition(4)"
                size="sm"
              />
            </span>
            <span v-else class="placeholder">4</span>
          </div>
          <div class="position-5" @click="selectedPosition = 5">
            <span v-if="getRotationPlayer(5)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(5)?.shirtNumber"
                size="lg"
              />
              <IconCaptain
                v-if="isCaptainInCourtPlayerAtPosition(5)"
                size="sm"
              />
            </span>
            <span v-else class="placeholder">5</span>
          </div>
          <div class="position-6" @click="selectedPosition = 6">
            <span v-if="getRotationPlayer(6)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(6)?.shirtNumber"
                size="lg"
              />
              <IconCaptain
                v-if="isCaptainInCourtPlayerAtPosition(6)"
                size="sm"
              />
            </span>
            <span v-else class="placeholder">6</span>
          </div>
        </div>
        <div class="side right">
          <div class="position-1"></div>
          <div class="position-2"></div>
          <div class="position-3"></div>
          <div class="position-4"></div>
          <div class="position-5"></div>
          <div class="position-6"></div>
        </div>
      </div>
    </div>

    <div
      class="inline-flex items-center justify-center mt-10 mb-3"
      @click="
        !!selectableCaptainPlayers.length &&
          !rotation?.locked &&
          (showCaptainSelector = true)
      "
    >
      <GameCallSelectedCaptain
        class="cursor-pointer"
        :class="{ 'grayscale pointer-events-none': rotation?.locked }"
        :player="selectedCaptain"
      />
      <Button
        v-if="
          selectedRotationInCourtCaptain &&
          !!selectableCaptainPlayers.length &&
          !rotation?.locked
        "
        class="change-captain-button ml-3"
        :label="$t('forms.change')"
        size="small"
      />
    </div>
  </div>

  <DialogBottom
    class="easy-coach-rotation-players-dialog-component"
    :visible="!!selectedPosition"
    @hide="selectedPosition = null"
  >
    <template #header>
      <Heading tag="h6">{{
        playerToReplace
          ? $t('players.replace_player', { name: getFullName(playerToReplace) })
          : $t('players.select')
      }}</Heading>
    </template>

    <CoachRotationPlayer
      v-for="player in availablePlayers"
      :player="player"
      @click="addOrReplaceRotationPlayer(player)"
    />
  </DialogBottom>

  <DialogBottom
    class="easy-coach-rotation-captain-selector-dialog-component"
    :visible="showCaptainSelector"
    @hide="showCaptainSelector = false"
  >
    <template #header>
      <Heading tag="h6">{{ $t('teams.captain_select') }}</Heading>
    </template>

    <CoachRotationPlayer
      v-for="player in selectableCaptainPlayers"
      :player="player"
      @click="setRotationCaptain(player)"
    />
  </DialogBottom>
</template>

<style scoped lang="scss">
.left {
  [class^='position-'] {
    cursor: pointer;

    .placeholder {
      color: var(--primary-color-medium);
    }

    &:hover {
      background-color: var(--primary-color-medium);

      .placeholder {
        color: var(--primary-color-light);
      }
    }
  }
  .position-1,
  .position-2,
  .position-3,
  .position-6 {
    border-top: solid 1px var(--primary-color-medium);
  }

  .easy-icon-shirt-number-component {
    background-color: var(--primary-color);
    border: solid 1px var(--primary-color-medium);
  }
}

.right {
  [class^='position-'] {
    filter: grayscale(100%);
    pointer-events: none;
  }
}

.easy-game-rotation-player-component {
  .easy-icon-captain-component {
    opacity: 1 !important;
  }

  &:hover {
    background-color: var(--primary-color-light);
  }
}

.court {
  &.is-disabled {
    .left {
      [class^='position-'] {
        filter: grayscale(100%);
        pointer-events: none;
      }
    }
  }
}

.change-captain-button {
  font-size: 0.7rem;
  padding: 0.3rem 0.5rem 0.325rem;
}
</style>

<script lang="ts">
export default {
  name: 'CoachRotationCourt',
}
</script>
