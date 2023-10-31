<script setup lang="ts">
import { Game } from '@/domain/game'
import { Call } from '@/domain/call'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
})

const app = useNuxtApp()
const toast = useEasyToast()

const showInjuriesDialog = ref<boolean>(false)

const actionButtonDisabled = computed(() => !!props.call.signedAt)

const onActionButtonClick = () => {
  if (props.call.signedAt) {
    toast.error(app.$i18n.t('reports.closed'))
    return
  }
  showInjuriesDialog.value = true
}
</script>

<template>
  <Button
    class="action"
    outlined
    :label="$t('games.injury', 2)"
    :disabled="actionButtonDisabled"
    @click="onActionButtonClick"
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonInjuries',
}
</script>
