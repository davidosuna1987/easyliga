<script setup lang="ts">
const props = defineProps({
  gameId: {
    type: Number,
    required: true,
  },
  teamId: {
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
  label: {
    type: String,
    required: false,
  },
})

const { t } = useI18n()
const toast = useEasyToast()

const labelText = computed(() => props.label ?? t('calls.call'))

const showCallLockedToast = () => {
  toast.warn(t('calls.locked_warning'))
}
</script>

<template>
  <Button
    class="easy-coach-button-call-component"
    outlined
    :label="labelText"
    :severity="
      props.severity ? props.severity : props.locked ? 'warning' : 'primary'
    "
    @click.prevent="
      props.locked
        ? showCallLockedToast()
        : navigateTo(`/coach/game/${props.gameId}/teams/${props.teamId}/call`)
    "
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonCall',
}
</script>
