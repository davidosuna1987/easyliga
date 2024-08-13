<script setup lang="ts">
import GameService from '@/services/game'
import { Game, isSameCoachForBothTeams, mapApiGameToGame } from '@/domain/game'
import { useAuthStore } from '@/stores/useAuthStore'
import { formatDateByLocale } from '@/domain/utils'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  showCalendar: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'calendar:show', value: Game): void
  (e: 'date:requested', value: Game): void
  (e: 'date:approved', value: Game): void
  (e: 'hide', value: number): void
}>()

const { t, locale } = useI18n()
const auth = useAuthStore()
const toast = useEasyToast()
const colorMode = useColorMode()

const gameService = new GameService()

const loadingApi = ref<boolean>(false)
const showApproveRequestedDateDialog = ref<boolean>(false)

const showApproveButton = computed(
  () =>
    auth.user &&
    props.game.requestedDate &&
    props.game.dateRequestedBy !== auth.user.id,
)

const approveRequestedDate = async () => {
  loadingApi.value = true

  const { data, error } = await gameService.approveRequestedDate(props.game.id)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success(t('games.date_request.approved'))
    emit('date:approved', mapApiGameToGame(data.value.data.game))
  }

  loadingApi.value = false
}
</script>

<template>
  <div class="easy-coach-button-change-date-component flex gap-2">
    <Button
      v-if="showApproveButton"
      class="action"
      :severity="colorMode.value === 'light' ? 'primary' : 'success'"
      outlined
      :label="t('games.date_request.approve')"
      :disabled="loadingApi"
      @click="showApproveRequestedDateDialog = true"
    />
    <Button
      class="action"
      severity="info"
      outlined
      :label="
        isSameCoachForBothTeams(game)
          ? t('games.date_request.change')
          : t('games.date_request.request')
      "
      :disabled="loadingApi"
      @click="emit('calendar:show', game)"
    />
    <CoachGameDateForm
      v-if="showCalendar"
      :game="game"
      @hide="emit('hide', game.id)"
      @date:requested="emit('date:requested', game)"
      hidden
    />

    <AlertDialog
      v-if="game.requestedDate"
      :visible="!!showApproveRequestedDateDialog"
      :title="t('games.date_request.approve')"
      :acceptLabel="t('forms.approve')"
      :disabled="loadingApi"
      @accepted="approveRequestedDate"
      @hide="showApproveRequestedDateDialog = false"
    >
      <p class="my-3 text-[1.15rem]">
        {{ t('games.date_request.approve_alert') }}
      </p>
      <p class="text-highlight text-[1.15rem]">
        {{ formatDateByLocale(game.requestedDate, locale) }}
      </p>
    </AlertDialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachButtonChangeDate',
}
</script>
