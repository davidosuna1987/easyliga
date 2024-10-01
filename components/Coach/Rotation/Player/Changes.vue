<script setup lang="ts">
import { Call, CallPlayerData, getPlayerDataByProfileId } from '@/domain/call'
import {
  RotationPlayerChangeRequest,
  ChangeType,
  mapPlayerChangeToChangeType,
  Rotation,
} from '@/domain/rotation'
import {
  Sanction,
  SanctionMember,
  SanctionMemberKey,
  getPlayerItemSanction,
} from '@/domain/sanction'

const props = defineProps({
  playersData: {
    type: Array as PropType<CallPlayerData[]>,
    required: true,
  },
  playerChanges: {
    type: Array as PropType<RotationPlayerChangeRequest[]>,
    required: true,
  },
  initialPlayerChanges: {
    type: Array as PropType<RotationPlayerChangeRequest[]>,
    required: true,
  },
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
  rotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  sanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'remove:playerChange', value: RotationPlayerChangeRequest): void
  (e: 'undo:playerChange', value: RotationPlayerChangeRequest): void
  (e: 'info:playerChange', value: RotationPlayerChangeRequest): void
}>()

const getPlayerSanction = (player?: CallPlayerData): Sanction | undefined => {
  if (!player || !props.rotation) return undefined
  return getPlayerItemSanction(
    props.sanctions,
    props.rotation?.setId,
    props.call.teamId,
    player.profileId,
    SanctionMember.player as SanctionMemberKey,
    'game',
  )
}
</script>

<template>
  <div class="easy-player-changes-component">
    <template
      v-for="(playerChange, index) in playerChanges"
      :key="playerChange.profileId"
    >
      <CoachRotationPlayerChangeItem
        :playersData="playersData"
        :playerChange="playerChange"
        :initialPlayerChange="props.initialPlayerChanges[index]"
        :initialPlayerSanction="
          getPlayerSanction(
            getPlayerDataByProfileId(props.playersData, playerChange.profileId),
          )
        "
        :replacementPlayerSanction="
          getPlayerSanction(
            getPlayerDataByProfileId(
              props.playersData,
              playerChange.replacementProfileId,
            ),
          )
        "
        :type="ChangeType.FIRST"
        :changesCount="mapPlayerChangeToChangeType(playerChange)"
        hasActions
        :hideRotationPendingSpinner="
          mapPlayerChangeToChangeType(playerChange) === ChangeType.SECOND
        "
        @remove:playerChange="emit('remove:playerChange', playerChange)"
        @undo:playerChange="emit('undo:playerChange', playerChange)"
        @info:playerChange="emit('info:playerChange', playerChange)"
      />
      <CoachRotationPlayerChangeItem
        v-if="mapPlayerChangeToChangeType(playerChange) === ChangeType.SECOND"
        :playersData="playersData"
        :playerChange="playerChange"
        :initialPlayerChange="props.initialPlayerChanges[index]"
        :initialPlayerSanction="
          getPlayerSanction(
            getPlayerDataByProfileId(
              props.playersData,
              playerChange.replacementProfileId,
            ),
          )
        "
        :replacementPlayerSanction="
          getPlayerSanction(
            getPlayerDataByProfileId(props.playersData, playerChange.profileId),
          )
        "
        :type="ChangeType.SECOND"
        :changesCount="mapPlayerChangeToChangeType(playerChange)"
        hasActions
        @remove:playerChange="emit('remove:playerChange', playerChange)"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachRotationPlayerChanges',
}
</script>
