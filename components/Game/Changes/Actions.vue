<script setup lang="ts">
import { Rotation } from '@/domain/rotation'

const props = defineProps({
  leftSideTeamRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  rightSideTeamRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
})

const numberToString = (playerChangesCount: number = 0) =>
  playerChangesCount.toString()
</script>

<template>
  <div class="easy-game-changes-actions-component">
    <div class="actions grid grid-cols-2 gap-4">
      <Button
        class="col-span-5/10"
        :label="$t('games.show_player_change', 2)"
        :badge="numberToString(leftSideTeamRotation?.playerChangesCount)"
        badgeClass="is-primary"
        outlined
      />
      <Button
        class="col-span-5/10"
        :label="$t('games.show_player_change', 2)"
        :badge="numberToString(rightSideTeamRotation?.playerChangesCount)"
        badgeClass="is-primary"
        outlined
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameChangesActions',
}
</script>

<style lang="scss">
.easy-game-changes-actions-component {
  max-width: var(--court-max-width);
  margin: 0 auto;
}
</style>
