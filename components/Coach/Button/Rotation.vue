<script setup lang="ts">
const toast = useEasyToast()

const props = defineProps({
  gameId: {
    type: Number,
    required: true,
  },
  callId: {
    type: Number,
    required: true,
  },
  rotationId: {
    type: Number,
    required: true,
  },
  teamId: {
    type: Number,
    required: true,
  },
  sanctionedPlayersToBeReplaced: {
    type: Boolean,
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
  callUnlocked: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
})

const { t } = useI18n()

const labelText = computed(() => props.label ?? t('rotations.rotation'))

const redirect = () => {
  if (props.callUnlocked) {
    showCallUnlockedLockedToast()
    return
  }

  if (props.locked) {
    showRotationLockedToast()
    return
  }

  if (props.sanctionedPlayersToBeReplaced) {
    navigateTo(
      `/coach/game/${props.gameId}/teams/${props.teamId}/rotations/${props.rotationId}/player-change`,
    )
  }

  navigateTo(`/coach/game/${props.gameId}/calls/${props.callId}/rotation`)
}

const showRotationLockedToast = () => toast.warn(t('rotations.locked'))

const showCallUnlockedLockedToast = () =>
  toast.warn(t('rotations.unable_to_set_rotation'))
</script>

<template>
  <Button
    class="easy-coach-button-rotation-component"
    outlined
    :label="labelText"
    :severity="
      props.severity
        ? props.severity
        : props.locked || props.callUnlocked
        ? 'warning'
        : 'primary'
    "
    @click.prevent="redirect()"
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonRotation',
}
</script>
