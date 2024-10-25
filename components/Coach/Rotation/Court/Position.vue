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
  playerIn: {
    type: Object as PropType<CallPlayerData>,
    required: false,
  },
  playerOut: {
    type: Object as PropType<CallPlayerData>,
    required: false,
  },
  playerInSanction: {
    type: Object as PropType<Sanction>,
    required: false,
  },
  playerOutSanction: {
    type: Object as PropType<Sanction>,
    required: false,
  },
  captainProfileId: {
    type: Number,
    required: true,
  },
  isInjured: {
    type: Boolean,
    default: false,
  },
  isPlayerOutInExtraordinaryChanges: {
    type: Boolean,
    default: false,
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
})

const maxPlayerChangesReached = computed(
  (): boolean => props.changesCount === ChangeType.SECOND,
)

const expulsedProfileIds = computed((): number[] => {
  const playerInSanctionProfileId =
    props.playerInSanction &&
    EXPULSION_SEVERITIES.includes(props.playerInSanction.severity)
      ? props.playerInSanction.playerProfileId ?? 0
      : 0

  const playerOutSanctionProfileId =
    props.playerOutSanction &&
    EXPULSION_SEVERITIES.includes(props.playerOutSanction.severity)
      ? props.playerOutSanction.playerProfileId ?? 0
      : 0

  return [playerInSanctionProfileId, playerOutSanctionProfileId].filter(
    id => !!id,
  )
})

const isPlayerExpulsed = (player?: CallPlayerData): boolean =>
  !!player && expulsedProfileIds.value.includes(player.profileId)
</script>

<template>
  <div
    :class="[
      `position-${position}`,
      {
        'is-pending': isRequestPending,
        'max-player-changes-reached': maxPlayerChangesReached && !playerOut,
        'is-sanctioned': isPlayerExpulsed(playerIn),
        'is-replacement-sanctioned': isPlayerExpulsed(playerOut),
        'is-injured': isInjured,
        'is-player-out-in-extraordinary-changes':
          isPlayerOutInExtraordinaryChanges,
      },
    ]"
  >
    <GameStatusSpinIcon v-if="props.showPendingStatus" status="pending" />

    <span
      v-if="props.playerIn"
      class="shirt-number"
      :data-profile-id="playerIn?.profileId"
    >
      <IconShirtNumber :shirtNumber="props.playerIn?.shirtNumber" size="lg" />
      <IconCaptain
        v-if="props.captainProfileId === props.playerIn?.profileId"
        size="sm"
      />
      <IconLibero v-if="props.playerIn.libero" size="sm" />
      <SanctionItem
        v-if="props.playerInSanction"
        :severity="props.playerInSanction.severity"
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

    <span
      v-if="props.playerOut"
      :data-profile-id="playerOut?.profileId"
      :class="[
        'shirt-number is-replaced',
        { 'brightness-75': props.isPlayerOutInExtraordinaryChanges },
      ]"
    >
      <IconShirtNumber :shirtNumber="props.playerOut?.shirtNumber" size="md" />
      <IconLibero v-if="props.playerOut?.libero" size="sm" />
      <SanctionItem
        v-if="props.playerOutSanction"
        :severity="props.playerOutSanction.severity"
        size="1.5rem"
      />
      <IconInjury
        v-if="props.isInjured"
        class="absolute -top-2 -right-2"
        size="1.25rem"
        bordered
      />
      <Icon
        v-if="props.isPlayerOutInExtraordinaryChanges"
        class="icon-max-changes-reached"
        :name="IconNames.maxPlayerChangesReached"
        size="1.25rem"
      />
    </span>
  </div>
</template>
