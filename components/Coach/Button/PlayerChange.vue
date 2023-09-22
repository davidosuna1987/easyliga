<script setup lang="ts">
import { Rotation } from '@/domain/rotation'

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

const showMaxPlayerChangesReachedToast = () => {
  toast.warn(useNuxtApp().$i18n.t('rotations.max_player_changes_reached'))
}
</script>

<template>
  <Button
    class="easy-coach-button-player-change-component"
    outlined
    :label="props.label"
    :severity="
      props.severity ? props.severity : props.locked ? 'warning' : 'primary'
    "
    @click.prevent="
      props.locked
        ? showMaxPlayerChangesReachedToast()
        : navigateTo(
            `/coach/games/${props.gameId}/teams/${props.teamId}/player-change`,
          )
    "
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonPlayerChange',
}
</script>
