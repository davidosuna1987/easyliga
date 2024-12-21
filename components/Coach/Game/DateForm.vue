<script setup lang="ts">
import GameService from '@/services/game'
import {
  Game,
  GameRequestChangeDateRequest,
  isSameCoachForBothTeams,
  mapApiGameToGame,
  mapGameRequestChangeDateRequestToApiGameRequestChangeDateRequest,
} from '@/domain/game'
import { ApiErrorObject } from '@/types/errors'
import { formatDateByLocale, formatDateTime } from '@/domain/utils'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  inlineButton: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'date:requested', value: Game): void
  (e: 'date:approved', value: Game): void
  (e: 'hide', value: boolean): void
}>()

const auth = useAuthStore()
const toast = useEasyToast()
const { t, locale } = useI18n()
const { isLightMode } = useTheme()

const gameService = new GameService()

const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const showApproveRequestedDateDialog = ref<boolean>(false)
const form = ref<GameRequestChangeDateRequest>({
  requestedDate: props.game.requestedDate
    ? new Date(props.game.requestedDate)
    : new Date(props.game.date || new Date()),
})

const minDate = computed(() => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
})

const showApproveButton = computed(
  () =>
    auth.user &&
    props.game.requestedDate &&
    props.game.dateRequestedBy !== auth.user.id,
)

const handleSubmit = () => {
  if (!props.game) return

  if (!form.value.requestedDate) {
    errors.value = {
      date: [t('errors.required_field')],
    }
    toast.error(t('errors.correct_before_proceed'))
    return
  }

  if (
    props.game.date &&
    formatDateTime(form.value.requestedDate) === formatDateTime(props.game.date)
  ) {
    toast.error(t('errors.games.date_request.same_date'))
    return
  }

  if (
    props.game.requestedDate &&
    formatDateTime(form.value.requestedDate) ===
      formatDateTime(props.game.requestedDate)
  ) {
    toast.error(t('errors.games.date_request.same_requested_date'))
    return
  }

  errors.value = null

  isSameCoachForBothTeams(props.game) ? changeDate() : requestChangeDate()
}

const requestChangeDate = async () => {
  loadingApi.value = true
  const { data, error } = await gameService.requestChangeDate(
    props.game.id,
    mapGameRequestChangeDateRequestToApiGameRequestChangeDateRequest(
      form.value,
    ),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else if (data.value) {
    toast.success(t('games.date_request.requested'))
    emit('date:requested', mapApiGameToGame(data.value.data.game))

    props.hidden || props.inlineButton ? handleHide() : navigateTo('/coach')
  }

  loadingApi.value = false
}

const changeDate = async () => {
  loadingApi.value = true
  const { data, error } = await gameService.changeDate(
    props.game.id,
    mapGameRequestChangeDateRequestToApiGameRequestChangeDateRequest(
      form.value,
    ),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else if (data.value) {
    toast.success(t('games.date_request.requested'))
    emit('date:requested', mapApiGameToGame(data.value.data.game))

    props.hidden || props.inlineButton ? handleHide() : navigateTo('/coach')
  }

  loadingApi.value = false
}

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

const handleCalendarShow = () => {
  const input = document.getElementById('calendar-game-date-input')
  input?.click()
}

const handleHide = () =>
  (document.querySelector('.p-datepicker-mask') as HTMLElement)?.click()
</script>

<template>
  <form
    class="'easy-coach-game-date-form-component"
    @submit.prevent="handleSubmit"
  >
    <div
      :class="[
        'max-w-[400px]',
        {
          'w-[1px] h-[1px] overflow-hidden absolute top-[-9999px] left-[-9999px]':
            hidden || inlineButton,
        },
      ]"
    >
      <FormLabel :label="t('games.datetime')" />
      <FormInputGroup>
        <Calendar
          v-model="form.requestedDate"
          class="w-full"
          inputId="calendar-game-date-input"
          :minDate="minDate"
          :showTime="true"
          :stepMinute="15"
          :touchUI="!inline"
          :inline="inline"
          :pt="{
            panel: {
              style: {
                filter: `grayscale(${loadingApi ? 1 : 0})`,
              },
            },
          }"
          @hide="emit('hide', true)"
        >
          <template v-if="hidden || inlineButton" #footer>
            <div class="flex justify-end p-2">
              <div
                v-if="loadingApi"
                class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25"
              ></div>
              <Button
                size="small"
                :loading="loadingApi"
                :label="
                  isSameCoachForBothTeams(game)
                    ? t('games.date_request.change')
                    : t('games.date_request.request')
                "
                :disabled="loadingApi"
                @click="handleSubmit"
              />
            </div>
          </template>
        </Calendar>
        <Button
          v-if="!hidden && !inline"
          type="submit"
          :loading="loadingApi"
          :label="t('forms.save')"
          :disabled="loadingApi"
        />
      </FormInputGroup>
    </div>
    <div v-if="inlineButton" class="flex gap-2">
      <Button
        v-if="showApproveButton"
        :severity="isLightMode ? 'primary' : 'success'"
        outlined
        :label="t('games.date_request.approve')"
        :disabled="loadingApi"
        @click="showApproveRequestedDateDialog = true"
      />
      <Button
        :label="
          isSameCoachForBothTeams(game)
            ? t('games.date_request.change')
            : t('games.date_request.request')
        "
        severity="info"
        outlined
        :disabled="loadingApi"
        @click="handleCalendarShow"
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
  </form>
</template>

<script lang="ts">
export default {
  name: 'CoachGameDateForm',
}
</script>
