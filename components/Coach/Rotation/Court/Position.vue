<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'
import { ChangeType } from '@/domain/rotation'
import { EXPULSION_SEVERITIES, Sanction } from '@/domain/sanction'
import { IconNames } from '@/domain/icon'

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
  isBeingReplaced: {
    type: Boolean,
    required: true,
  },
  isRequestPending: {
    type: Boolean,
    default: false,
  },
  showPendingStatus: {
    type: Boolean,
    default: false,
  },
  changesCount: {
    type: Number as PropType<ChangeType>,
    required: true,
  },
  initialPlayerSanction: {
    type: Object as PropType<Sanction>,
    required: false,
  },
  replacementPlayerSanction: {
    type: Object as PropType<Sanction>,
    required: false,
  },
})

const maxPlayerChangesReached = computed(
  (): boolean => props.changesCount === ChangeType.SECOND,
)

const showReplacementShirtNumber = computed(
  (): boolean => props.isBeingReplaced && !maxPlayerChangesReached.value,
)

const sanctionsProfileIds = computed((): number[] => {
  const initialPlayerSanctionProfileId =
    props.initialPlayerSanction &&
    EXPULSION_SEVERITIES.includes(props.initialPlayerSanction.severity)
      ? props.initialPlayerSanction.playerProfileId ?? 0
      : 0

  const replacementPlayerSanctionProfileId =
    props.replacementPlayerSanction &&
    EXPULSION_SEVERITIES.includes(props.replacementPlayerSanction.severity)
      ? props.replacementPlayerSanction.playerProfileId ?? 0
      : 0
  return [
    initialPlayerSanctionProfileId,
    replacementPlayerSanctionProfileId,
  ].filter(id => id !== 0)
})

const replacementSanctioned = computed(
  (): boolean =>
    !!props.isBeingReplaced &&
    !!props.player &&
    sanctionsProfileIds.value.includes(props.player.profileId),
)

const inCourtSanctioned = computed(
  (): boolean =>
    !!props.inCourtPlayer &&
    sanctionsProfileIds.value.includes(props.inCourtPlayer.profileId),
)
</script>

<template>
  <div
    :class="[
      `position-${position}`,
      {
        'is-pending': isRequestPending,
        'is-being-replaced': showReplacementShirtNumber,
        'max-player-changes-reached':
          maxPlayerChangesReached && !isBeingReplaced,
        'is-sanctioned': inCourtSanctioned,
        'is-replacement-sanctioned': replacementSanctioned,
      },
    ]"
  >
    <GameStatusSpinIcon v-if="props.showPendingStatus" status="pending" />

    <span v-if="props.isBeingReplaced" class="shirt-number">
      <IconShirtNumber
        :shirtNumber="props.inCourtPlayer?.shirtNumber"
        size="lg"
      />
      <IconCaptain
        v-if="
          props.captainProfileId === props.inCourtPlayer?.profileId &&
          showReplacementShirtNumber
        "
        size="sm"
      />
      <IconLibero v-if="props.inCourtPlayer?.libero" size="sm" />
      <SanctionItem
        v-if="
          props.replacementPlayerSanction &&
          props.replacementPlayerSanction.playerProfileId ===
            props.inCourtPlayer?.profileId
        "
        :severity="props.replacementPlayerSanction.severity"
        size="1.5rem"
      />
    </span>
    <span
      v-if="props.player"
      class="shirt-number"
      :class="{ 'is-replaced': showReplacementShirtNumber }"
    >
      <IconShirtNumber
        :shirtNumber="props.player?.shirtNumber"
        :size="showReplacementShirtNumber ? 'md' : 'lg'"
      />
      <IconCaptain
        v-if="
          props.captainProfileId === props.player?.profileId &&
          !showReplacementShirtNumber
        "
        size="sm"
      />
      <IconLibero v-if="props.player.libero" size="sm" />
      <SanctionItem
        v-if="
          props.initialPlayerSanction &&
          props.initialPlayerSanction.playerProfileId ===
            props.player?.profileId
        "
        :severity="props.initialPlayerSanction.severity"
        size="1.5rem"
      />
      <Icon
        v-if="props.changesCount === ChangeType.SECOND"
        class="icon-max-changes-reached"
        :name="IconNames.maxPlayerChangesReached"
        size="1.5rem"
      />
    </span>
    <span v-else class="placeholder">{{ props.position }}</span>
  </div>
</template>
