<script setup lang="ts">
const props = defineProps({
  player: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <div
    class="easy-game-call-selected-captain-component"
    :class="{ 'text-gray-300': !player }"
  >
    <IconCaptain />
    {{ player ?? $t('teams.captain_select') }}
  </div>
</template>

<style scoped lang="scss">
.easy-game-call-selected-captain-component {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.5rem;

  .easy-icon-captain-component {
    pointer-events: none;
    user-select: none;
  }
}
</style>

<script lang="ts">
export default {
  name: 'GameCallSelectedCaptain',
}
</script>
