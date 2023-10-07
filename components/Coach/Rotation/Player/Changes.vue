<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'
import {
  RotationPlayerChangeRequest,
  ChangeType,
  mapPlayerChangeToChangeType,
} from '@/domain/rotation'

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
})

const emit = defineEmits(['remove:playerChange', 'undo:playerChange'])
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
        :type="ChangeType.FIRST"
        :changesCount="mapPlayerChangeToChangeType(playerChange)"
        hasActions
        @remove:playerChange="emit('remove:playerChange', playerChange)"
        @undo:playerChange="emit('undo:playerChange', playerChange)"
      />
      <CoachRotationPlayerChangeItem
        v-if="mapPlayerChangeToChangeType(playerChange) === ChangeType.SECOND"
        :playersData="playersData"
        :playerChange="playerChange"
        :initialPlayerChange="props.initialPlayerChanges[index]"
        :type="ChangeType.SECOND"
        :changesCount="mapPlayerChangeToChangeType(playerChange)"
        hasActions
        @remove:playerChange="emit('remove:playerChange', playerChange)"
      />
    </template>
  </div>
</template>
