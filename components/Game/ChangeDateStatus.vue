<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { Game } from '@/domain/game'
import { formatDateByLocale, formatDateTime } from '@/domain/utils'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    default: false,
  },
  fullDate: {
    type: Boolean,
    default: false,
  },
})

const { t, locale } = useI18n()
const auth = useAuthStore()

const key = computed(() => {
  if (!auth.user || !props.game.dateRequestedBy) return
  return props.game.dateRequestedBy === auth.user.id ? 'waiting' : 'porposal'
})

const formattedDate = computed(() => {
  if (!props.game.requestedDate) return

  return props.fullDate
    ? formatDateByLocale(props.game.requestedDate, locale.value)
    : formatDateTime(props.game.requestedDate)
})

const label = computed(() => {
  if (!props.game.dateRequestedBy) return

  return t(`games.date_request.${key.value}`, {
    date: formattedDate.value,
  })
})
</script>

<template>
  <div
    class="easy-game-change-date-status-component inline-flex items-center gap-1"
  >
    <GameStatusSpinIcon :status="`date-change-${key}`" />
    <span>{{ label }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameChangeDateStatus',
}
</script>
