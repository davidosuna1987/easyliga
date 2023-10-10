<script setup lang="ts">
import { Rotation } from '@/domain/rotation'

const router = useRouter()
const toast = useEasyToast()

const props = defineProps({
  gameId: {
    type: Number,
    required: true,
  },
  teamId: {
    type: Number,
    required: true,
  },
  rotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  severity: {
    type: String,
    required: false,
  },
  locked: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    default: () => useNuxtApp().$i18n.t('games.player_change', 2),
  },
})

const handleLockedToast = () => {
  props.rotation?.locked
    ? showLockedToast()
    : showMaxPlayerChangesReachedToast()
}

const showLockedToast = () => {
  toast.warn(useNuxtApp().$i18n.t('rotations.locked_changes'), {
    life: 10000,
  })
}

const showMaxPlayerChangesReachedToast = () => {
  toast.warn(useNuxtApp().$i18n.t('rotations.max_player_changes_reached'))
}

const showNoRotationToast = () => {
  toast.warn(useNuxtApp().$i18n.t('rotations.no_rotation'))
}
</script>

<template>
  <Button
    class="easy-coach-button-player-change-component"
    outlined
    :label="props.label"
    :severity="
      props.severity
        ? props.severity
        : props.locked || !props.rotation
        ? 'warning'
        : 'primary'
    "
    @click.prevent="
      props.locked
        ? handleLockedToast()
        : !!props.rotation
        ? navigateTo(
            `/coach/games/${props.gameId}/teams/${props.teamId}/rotations/${props.rotation?.id}/player-change`,
          )
        : showNoRotationToast()
    "
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonPlayerChange',
}
</script>
