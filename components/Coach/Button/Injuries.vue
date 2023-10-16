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
</script>

<template>
  <Button class="action" outlined :label="$t('games.injury', 2)" />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonInjuries',
}
</script>
