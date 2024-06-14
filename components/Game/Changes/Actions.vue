<script setup lang="ts">
import {
  Rotation,
  RotationPlayerChange,
  RotationWindowPlayerChange,
  mapRotationToRotationPlayerChanges,
  mapRotationToRotationWindowPlayerChanges,
} from '@/domain/rotation'
import { Call } from '@/domain/call'
import { TeamSide, TeamSideEnum } from '@/domain/team'

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

const selectedTeamSide = ref<TeamSide>()

const playerChanges = computed((): RotationPlayerChange[] => {
  switch (selectedTeamSide.value) {
    case TeamSideEnum.left:
      return leftSideTeamPlayerChanges.value ?? []
    case TeamSideEnum.right:
      return rightSideTeamPlayerChanges.value ?? []
    default:
      return []
  }
})

const windowPlayerChanges = computed((): RotationWindowPlayerChange[] => {
  switch (selectedTeamSide.value) {
    case TeamSideEnum.left:
      return leftSideTeamWindowPlayerChanges.value ?? []
    case TeamSideEnum.right:
      return rightSideTeamWindowPlayerChanges.value ?? []
    default:
      return []
  }
})

const rotation = computed((): Rotation | undefined => {
  switch (selectedTeamSide.value) {
    case TeamSideEnum.left:
      return props.leftSideTeamRotation
    case TeamSideEnum.right:
      return props.rightSideTeamRotation
    default:
      return undefined
  }
})

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

const leftSideTeamWindowPlayerChanges = computed(
  () =>
    props.leftSideTeamRotation &&
    mapRotationToRotationWindowPlayerChanges(
      props.leftSideTeamRotation,
      props.leftSideTeamCall.playersData,
    ),
)

const rightSideTeamWindowPlayerChanges = computed(
  () =>
    props.rightSideTeamRotation &&
    mapRotationToRotationWindowPlayerChanges(
      props.rightSideTeamRotation,
      props.rightSideTeamCall.playersData,
    ),
)

const numberToString = (playerChangesCount: number = 0) =>
  playerChangesCount.toString()

const removePlayerChange = async (playerChange: RotationPlayerChange) => {
  const targetRotation = props.leftSideTeamRotation?.players.find(player =>
    [playerChange.in.profileId, playerChange.out.profileId].includes(
      player.profileId,
    ),
  )
    ? props.leftSideTeamRotation
    : props.rightSideTeamRotation

  // TODO: Implement this method
}
</script>

<template>
  <div class="easy-game-changes-actions-component">
    <EasyGrid class="actions" :cols="2" :gap="4">
      <Button
        class="col-span-5/10"
        :label="$t('games.show_player_change', 2)"
        :badge="numberToString(leftSideTeamRotation?.playerChangesCount)"
        badgeClass="is-primary"
        outlined
        @click.prevent="selectedTeamSide = TeamSideEnum.left"
      />
      <Button
        class="col-span-5/10"
        :label="$t('games.show_player_change', 2)"
        :badge="numberToString(rightSideTeamRotation?.playerChangesCount)"
        badgeClass="is-primary"
        outlined
        @click.prevent="selectedTeamSide = TeamSideEnum.right"
      />
    </EasyGrid>

    <DialogBottom
      class="easy-coach-rotation-captain-selector-dialog-component"
      :visible="!!selectedTeamSide"
      @hide="selectedTeamSide = undefined"
    >
      <template #header>
        <Heading tag="h6">{{ $t('rotations.player_change_done', 2) }}</Heading>
      </template>

      <Message v-if="playerChanges?.length === 0" :closable="false">{{
        $t('rotations.player_change_done', 0)
      }}</Message>

      <!-- <template v-if="playerChanges">
        <RotationPlayerChangeItem
          v-for="(change, index) in playerChanges"
          :key="index"
          class="mt-4"
          :playerIn="change.in"
          :playerOut="change.out"
          :action="
            playerChangeCanBeRemoved(change, rotation?.currentChangeWindow ?? 0)
              ? 'remove'
              : 'done'
          "
          @change:remove="removePlayerChange(change)"
        />
      </template> -->
      <template
        v-if="windowPlayerChanges"
        v-for="windowPlayerChange in windowPlayerChanges"
      >
        <div
          v-for="(playerChanges, changeWindow) in windowPlayerChange"
          :key="changeWindow"
          class="mt-3 mb-6"
        >
          <Heading tag="h6">
            {{ $t('games.change_window_num', { num: changeWindow }) }}
          </Heading>

          <RotationPlayerChangeItem
            v-for="(change, index) in playerChanges"
            :key="index"
            class="mt-4"
            :playerIn="change.in"
            :playerOut="change.out"
            :action="
              // TODO: Implement this method when remove player changes also captain to previous one
              // playerChangeCanBeRemoved(
              //   change,
              //   rotation?.currentChangeWindow ?? 0,
              // )
              //   ? 'remove'
              //   : 'done'
              undefined
            "
            @change:remove="removePlayerChange(change)"
          />
        </div>
      </template>
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
