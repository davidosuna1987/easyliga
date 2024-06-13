<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'
import {
  RotationPlayerChangeRequest,
  ChangeType,
  mapPlayerChangeToChangeType,
} from '@/domain/rotation'
import { EXPULSION_SEVERITIES, Sanction } from '@/domain/sanction'

const props = defineProps({
  playersData: {
    type: Array as PropType<CallPlayerData[]>,
    required: true,
  },
  playerChange: {
    type: Object as PropType<RotationPlayerChangeRequest>,
    required: true,
  },
  initialPlayerChange: {
    type: Object as PropType<RotationPlayerChangeRequest>,
    required: false,
  },
  initialPlayerSanction: {
    type: Object as PropType<Sanction>,
    required: false,
  },
  replacementPlayerSanction: {
    type: Object as PropType<Sanction>,
    required: false,
  },
  type: {
    type: Number as PropType<ChangeType>,
    required: true,
  },
  changesCount: {
    type: Number,
    required: true,
  },
  hasActions: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'remove:playerChange', value: RotationPlayerChangeRequest): void
  (e: 'undo:playerChange', value: RotationPlayerChangeRequest): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const ICON_TYPE = {
  REMOVE: 'remove',
  DONE: 'done',
  UNDO: 'undo',
  HELP: 'help',
}

const ICON_NAME = {
  REMOVE: 'ic:baseline-delete',
  DONE: 'ic:baseline-check-circle',
  UNDO: 'ic:baseline-replay-circle-filled',
  HELP: 'ic:baseline-help',
}

const initialPlayerChangeType = computed(
  (): ChangeType => mapPlayerChangeToChangeType(props.initialPlayerChange),
)

const iconTypeBasedOnPlayerChangeTypes = computed((): string => {
  if (!props.playerChange.comesFromApi) return ICON_TYPE.REMOVE

  switch (props.changesCount) {
    case 1:
      return ICON_TYPE.UNDO
    case 2:
      return initialPlayerChangeType.value === ChangeType.FIRST &&
        props.type === ChangeType.SECOND
        ? ICON_TYPE.REMOVE
        : ICON_TYPE.DONE
    default:
      return ICON_TYPE.HELP
  }
})

const iconNameBasedOnPlayerChangeTypes = computed((): string => {
  switch (iconTypeBasedOnPlayerChangeTypes.value) {
    case ICON_TYPE.REMOVE:
      return ICON_NAME.REMOVE
    case ICON_TYPE.DONE:
      return ICON_NAME.DONE
    case ICON_TYPE.UNDO:
      return ICON_NAME.UNDO
    default:
      return ICON_NAME.HELP
  }
})

const replacementPlayerIsSanctioned = computed(
  (): boolean =>
    props.playerChange.comesFromApi &&
    props.changesCount === 1 &&
    !!props.initialPlayerSanction &&
    EXPULSION_SEVERITIES.includes(props.initialPlayerSanction.severity),
)

const getPlayerDataByProfileId = (
  profileId: number,
): CallPlayerData | undefined => {
  return props.playersData.find(p => p.profileId === profileId)
}

const replacedPlayer = computed(() => {
  if (props.type === ChangeType.NONE) return

  const profileId =
    props.type === ChangeType.FIRST
      ? props.playerChange.profileId
      : props.playerChange.replacementProfileId

  return getPlayerDataByProfileId(profileId)
})

const replacementPlayer = computed(() => {
  if (props.type === ChangeType.NONE) return

  const profileId =
    props.type === ChangeType.FIRST
      ? props.playerChange.replacementProfileId
      : props.playerChange.profileId

  return getPlayerDataByProfileId(profileId)
})

const handleActionClick = () => {
  if (replacementPlayerIsSanctioned.value) {
    toast.error(t('rotations.replacement_player_sanctioned'))
    return
  }
  if (iconTypeBasedOnPlayerChangeTypes.value === ICON_TYPE.REMOVE) {
    emit('remove:playerChange', props.playerChange)
  } else if (iconTypeBasedOnPlayerChangeTypes.value === ICON_TYPE.UNDO) {
    emit('undo:playerChange', props.playerChange)
  }
}
</script>

<template>
  <div
    v-if="replacedPlayer && replacementPlayer"
    class="easy-player-change-item-component gap-3 mb-2"
    :class="{ 'has-actions': props.hasActions, 'is-block': props.block }"
  >
    <div class="player-container">
      <PlayerItem
        :player="replacementPlayer"
        :showCaptain="false"
        :showLibero="false"
        :showIcons="false"
        :selectable="false"
        :sanction="props.replacementPlayerSanction"
      />
    </div>
    <img class="arrows-icon" src="/icons/change-player.svg" width="40" />
    <div class="player-container">
      <PlayerItem
        :player="replacedPlayer"
        :showCaptain="false"
        :showLibero="false"
        :showIcons="false"
        :selectable="false"
        :sanction="props.initialPlayerSanction"
      />
    </div>
    <div v-if="hasActions" class="actions">
      <Icon
        class="action"
        :class="[
          `action-${iconTypeBasedOnPlayerChangeTypes}`,
          { 'is-replacement-sanctioned': replacementPlayerIsSanctioned },
        ]"
        :name="iconNameBasedOnPlayerChangeTypes"
        size="1.5rem"
        @click="handleActionClick()"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachRotationPlayerChangeItem',
}
</script>
