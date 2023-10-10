<script setup lang="ts">
import {
  Rotation,
  RotationPlayerChange,
  mapRotationToRotationPlayerChanges,
} from '@/domain/rotation'
import { Call } from '@/domain/call'
import { getFullName } from '@/domain/player'

const props = defineProps({
  leftSideTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  rightSideTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  leftSideTeamRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  rightSideTeamRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
})

const playerChanges = ref<RotationPlayerChange[]>()

const leftSideTeamPlayerChanges = computed(
  () =>
    props.leftSideTeamRotation &&
    mapRotationToRotationPlayerChanges(
      props.leftSideTeamRotation,
      props.leftSideTeamCall.playersData,
    ),
)

const rightSideTeamPlayerChanges = computed(
  () =>
    props.rightSideTeamRotation &&
    mapRotationToRotationPlayerChanges(
      props.rightSideTeamRotation,
      props.rightSideTeamCall.playersData,
    ),
)

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
        @click.prevent="playerChanges = leftSideTeamPlayerChanges"
      />
      <Button
        class="col-span-5/10"
        :label="$t('games.show_player_change', 2)"
        :badge="numberToString(rightSideTeamRotation?.playerChangesCount)"
        badgeClass="is-primary"
        outlined
        @click.prevent="playerChanges = rightSideTeamPlayerChanges"
      />
    </div>

    <DialogBottom
      class="easy-coach-rotation-captain-selector-dialog-component"
      :visible="!!playerChanges"
      @hide="playerChanges = undefined"
    >
      <template #header>
        <Heading tag="h6">{{ $t('rotations.player_change_done', 2) }}</Heading>
      </template>

      <Message v-if="playerChanges?.length === 0" :closable="false">{{
        $t('rotations.player_change_done', 0)
      }}</Message>

      <RotationPlayerChangeItem
        v-for="(change, index) in playerChanges"
        :key="index"
        class="mt-4"
        :playerIn="change.in"
        :playerOut="change.out"
      />
    </DialogBottom>
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
