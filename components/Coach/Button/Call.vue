<script setup lang="ts">
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
    default: () => useNuxtApp().$i18n.t('calls.call'),
  },
})

const showCallLockedToast = () => {
  toast.warn(useNuxtApp().$i18n.t('calls.locked_warning'))
}
</script>

<template>
  <Button
    class="easy-coach-button-call-component"
    outlined
    :label="props.label"
    :severity="
      props.severity ? props.severity : props.locked ? 'warning' : 'primary'
    "
    @click.prevent="
      props.locked
        ? showCallLockedToast()
        : navigateTo(`/coach/games/${props.gameId}/teams/${props.teamId}/call`)
    "
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonCall',
}
</script>
