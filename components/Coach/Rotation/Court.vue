<script setup lang="ts">
import { Call, CallPlayerData } from '@/domain/call'
import { RotationPlayer } from '@/domain/rotation'
import { Rotation } from '@/domain/rotation'

const props = defineProps({
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
  rotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
})

const emit = defineEmits(['update:players'])

const players = ref<RotationPlayer[]>([])
const selectedPosition = ref<number | null>(null)

const availablePlayers = computed(() =>
  props.call.playersData.filter(
    player => !players.value.map(p => p.profileId).includes(player.profileId),
  ),
)

const addOrReplaceRotationPlayer = (player: CallPlayerData) => {
  if (!selectedPosition.value) return
  if (props.rotation?.players) return

  const existingPlayer = players.value.find(
    rp => rp.position === selectedPosition.value,
  )

  if (existingPlayer) {
    players.value = players.value.filter(
      rp => rp.position !== selectedPosition.value,
    )
  }

  players.value.push({
    profileId: player.profileId,
    rotationId: 0,
    replacementProfileId: null,
    inCourtProfileId: player.profileId,
    position: selectedPosition.value,
    libero: player.libero,
  })

  selectedPosition.value = null
}

const getRotationPlayer = (position: number): CallPlayerData | undefined =>
  props.call.playersData.find(
    p =>
      p.profileId ===
      players.value.find(rp => rp.position === position)?.profileId,
  )

watch(players.value, newVal => emit('update:players', newVal))

watch(
  () => props.rotation,
  () => {
    if (props.rotation?.players) {
      players.value = props.rotation.players
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
              <IconCaptain v-if="getRotationPlayer(1)?.captain" size="sm" />
              <IconLibero v-if="getRotationPlayer(1)?.libero" size="sm" />
            </span>
            <span v-else class="placeholder">1</span>
          </div>
          <div class="position-2" @click="selectedPosition = 2">
            <span v-if="getRotationPlayer(2)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(2)?.shirtNumber"
                size="lg"
              />
              <IconCaptain v-if="getRotationPlayer(2)?.captain" size="sm" />
              <IconLibero v-if="getRotationPlayer(2)?.libero" size="sm" />
            </span>
            <span v-else class="placeholder">2</span>
          </div>
          <div class="position-3" @click="selectedPosition = 3">
            <span v-if="getRotationPlayer(3)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(3)?.shirtNumber"
                size="lg"
              />
              <IconCaptain v-if="getRotationPlayer(3)?.captain" size="sm" />
              <IconLibero v-if="getRotationPlayer(3)?.libero" size="sm" />
            </span>
            <span v-else class="placeholder">3</span>
          </div>
          <div class="position-4" @click="selectedPosition = 4">
            <span v-if="getRotationPlayer(4)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(4)?.shirtNumber"
                size="lg"
              />
              <IconCaptain v-if="getRotationPlayer(4)?.captain" size="sm" />
              <IconLibero v-if="getRotationPlayer(4)?.libero" size="sm" />
            </span>
            <span v-else class="placeholder">4</span>
          </div>
          <div class="position-5" @click="selectedPosition = 5">
            <span v-if="getRotationPlayer(5)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(5)?.shirtNumber"
                size="lg"
              />
              <IconCaptain v-if="getRotationPlayer(5)?.captain" size="sm" />
              <IconLibero v-if="getRotationPlayer(5)?.libero" size="sm" />
            </span>
            <span v-else class="placeholder">5</span>
          </div>
          <div class="position-6" @click="selectedPosition = 6">
            <span v-if="getRotationPlayer(6)" class="shirt-number">
              <IconShirtNumber
                :shirtNumber="getRotationPlayer(6)?.shirtNumber"
                size="lg"
              />
              <IconCaptain v-if="getRotationPlayer(6)?.captain" size="sm" />
              <IconLibero v-if="getRotationPlayer(6)?.libero" size="sm" />
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
  </div>

  <DialogBottom
    class="easy-game-call-shirt-number-dialog-component"
    :visible="!!selectedPosition"
    @hide="selectedPosition = null"
  >
    <template #header>
      <Heading tag="h6">{{ $t('players.select') }}</Heading>
    </template>

    <CoachRotationPlayer
      v-for="player in availablePlayers"
      :player="player"
      @click="addOrReplaceRotationPlayer(player)"
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
  .easy-icon-captain-component,
  .easy-icon-libero-component {
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
</style>

<script lang="ts">
export default {
  name: 'CoachRotationCourt',
}
</script>
