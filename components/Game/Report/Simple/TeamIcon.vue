<script setup lang="ts">
import { GameReportTeamType, GameReportTeamTypes } from '@/domain/game'

const props = defineProps({
  type: String as PropType<GameReportTeamType>,
})

const bgColor = computed(() =>
  props.type === GameReportTeamTypes.A
    ? 'bg-[var(--primary-color-medium)]'
    : 'bg-tertiary',
)
</script>

<template>
  <span
    :class="[
      'easy-game-report-sanction-team-item-component grid place-content-center leading-5 rounded-full border-solid w-5 h-5 text-xs font-semibold',
      bgColor,
    ]"
  >
    {{ type }}
  </span>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleTeamIcon',
}
</script>
