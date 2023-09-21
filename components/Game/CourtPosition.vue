<script setup lang="ts">
import { Player } from '@/domain/player'

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
})
</script>

<template>
  <div :class="[`position-${position}`, { serving: serving }]">
    <IconEasyLiga v-if="serving" />
    <IconCaptain v-if="player?.profileId === captainProfileId" size="sm" />
    <IconLibero v-if="player?.libero" size="sm" />
    <span class="shirt-number">{{ player?.shirtNumber }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCourtPosition',
}
</script>
