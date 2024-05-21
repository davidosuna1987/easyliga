<script setup lang="ts">
import { Player } from '@/domain/player'
import { Sanction, EXPULSION_SEVERITIES } from '@/domain/sanction'
import { ShirtColor } from '@/domain/team'

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

const styles = computed(() => ({
  '--player-color': props.color,
}))
</script>

<template>
  <div
    :class="[
      `position-${position}`,
      {
        serving,
        'is-sanctioned':
          props.sanction?.severity &&
          EXPULSION_SEVERITIES.includes(props.sanction?.severity),
      },
    ]"
  >
    <span class="shirt-number" :style="styles">
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

<!-- <style scoped>
.easy-game-court-component
  .side
  .shirt-number
  .easy-icon-shirt-number-component {
  background-color: var(--player-color);
}
</style> -->
