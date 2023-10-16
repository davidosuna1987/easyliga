<script setup lang="ts">
import { Game } from '@/domain/game'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
})

const app = useNuxtApp()
const toast = useEasyToast()
</script>

<template>
  <Button class="action" outlined :label="$t('games.observation', 2)" />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonObservations',
}
</script>
