<script setup lang="ts">
import { Set, SetSide } from '@/domain/set'

const props = defineProps({
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
})

const leftSideTeamScore = computed(() => {
  return props.currentSet.localTeamSide === SetSide.LEFT
    ? props.currentSet.localTeamScore
    : props.currentSet.visitorTeamScore
})

const rightSideTeamScore = computed(() => {
  return props.currentSet.localTeamSide === SetSide.RIGHT
    ? props.currentSet.localTeamScore
    : props.currentSet.visitorTeamScore
})
</script>

<template>
  <div class="easy-game-score-component">
    <div class="score left">{{ leftSideTeamScore }}</div>
    <div class="set">{{ currentSet.number }}</div>
    <div class="score right">{{ rightSideTeamScore }}</div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameScore',
}
</script>
