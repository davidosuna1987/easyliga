<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'
import { ChangeType } from '@/domain/rotation'

const props = defineProps({
  position: {
    type: Number,
    required: true,
  },
  player: {
    type: Object as PropType<CallPlayerData>,
    required: false,
  },
  inCourtPlayer: {
    type: Object as PropType<CallPlayerData>,
    required: false,
  },
  captainProfileId: {
    type: Number,
    required: true,
  },
  itsBeingReplaced: {
    type: Boolean,
    required: true,
  },
  changesCount: {
    type: Number as PropType<ChangeType>,
    required: true,
  },
})
</script>

<template>
  <div
    :class="[
      `position-${position}`,
      {
        'is-being-replaced': props.itsBeingReplaced,
        'max-player-changes-reached': props.changesCount === ChangeType.SECOND,
      },
    ]"
  >
    <span v-if="props.itsBeingReplaced" class="shirt-number">
      <IconShirtNumber
        :shirtNumber="props.inCourtPlayer?.shirtNumber"
        size="lg"
      />
      <IconCaptain
        v-if="
          props.captainProfileId === props.inCourtPlayer?.profileId &&
          props.itsBeingReplaced
        "
        size="sm"
      />
      <IconLibero v-if="props.inCourtPlayer?.libero" size="sm" />
    </span>
    <span
      v-if="props.player"
      class="shirt-number"
      :class="{ 'is-replaced': props.itsBeingReplaced }"
    >
      <IconShirtNumber
        :shirtNumber="props.player?.shirtNumber"
        :size="props.itsBeingReplaced ? 'md' : 'lg'"
      />
      <IconCaptain
        v-if="
          props.captainProfileId === props.player?.profileId &&
          !props.itsBeingReplaced
        "
        size="sm"
      />
      <IconLibero v-if="props.player.libero" size="sm" />
      <Icon
        v-if="props.changesCount === ChangeType.SECOND"
        class="icon-max-changes-reached"
        name="ic:round-autorenew"
        size="1.5rem"
      />
    </span>
    <span v-else class="placeholder">{{ props.position }}</span>
  </div>
</template>
