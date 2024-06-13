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
    @click.prevent="
      props.callUnlocked
        ? showCallUnlockedLockedToast()
        : props.locked
        ? showRotationLockedToast()
        : navigateTo(`/coach/games/${gameId}/calls/${callId}/rotation`)
    "
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonRotation',
}
</script>
