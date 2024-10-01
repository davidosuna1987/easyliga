<script setup lang="ts">
import { Player } from '@/domain/player'
import { Sanction, EXPULSION_SEVERITIES } from '@/domain/sanction'
import { ShirtColor } from '@/domain/team'
import { ROTATION_PLAYER_STATUS } from '@/domain/rotation'

const props = defineProps({
  position: {
    type: Number,
    required: true,
  },
  player: {
    type: Object as PropType<Player>,
    required: false,
  },
  serving: {
    type: Boolean,
    default: false,
  },
  captainProfileId: {
    type: Number,
    default: 0,
  },
  sanction: {
    type: Object as PropType<Sanction>,
    required: false,
  },
  color: {
    type: String as PropType<ShirtColor>,
    required: false,
  },
})

const showPendingStatus = computed(
  (): boolean => props.player?.changeStatus === ROTATION_PLAYER_STATUS.pending,
)
</script>

<template>
  <div
    :class="[
      `position-${position}`,
      {
        serving,
        'is-pending': showPendingStatus,
        'is-sanctioned':
          props.sanction?.severity &&
          EXPULSION_SEVERITIES.includes(props.sanction?.severity),
      },
    ]"
  >
    <GameStatusSpinIcon v-if="showPendingStatus" status="pending" />

    <span class="shirt-number">
      <IconShirtNumber
        :shirtNumber="player?.shirtNumber"
        size="lg"
        :color="color"
      />
    </span>
    <IconEasyLiga v-if="serving" size="54" />
    <IconCaptain v-if="player?.profileId === captainProfileId" size="sm" />
    <IconLibero v-if="player?.libero" size="sm" />
    <SanctionItem
      v-if="props.sanction"
      :severity="props.sanction?.severity"
      size="1.5rem"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCourtPosition',
}
</script>
