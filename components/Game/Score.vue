<script setup lang="ts">
import { Set } from '@/domain/set'

const props = defineProps({
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-score-component">
    <div class="score left">{{ currentSet.localTeamScore }}</div>
    <div class="set">{{ currentSet.number }}</div>
    <div class="score right">{{ currentSet.visitorTeamScore }}</div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameScore',
}
</script>

<style scoped lang="scss">
.easy-game-score-component {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -75%);
  z-index: 2;
  margin: 0 auto;
  border: solid 2px var(--primary-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  display: flex;

  .score {
    background: var(--primary-color-medium);
    padding: 1rem;
    font-size: 1.75rem;
    font-weight: 700;
  }

  .set {
    display: grid;
    place-content: center;
    color: var(--primary-color-dark);
    background: white;
    border-inline: solid 2px var(--primary-color);
    padding-inline: 1.5rem;
    font-size: 1.25rem;
    font-size: 1.75rem;
    font-weight: 700;
    white-space: nowrap;
  }
}
</style>
