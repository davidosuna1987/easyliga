<script setup lang="ts">
import GameService from '@/services/game'
import { Game, mapDateToApiGameRequestChangeDateRequest } from '@/domain/game'
import { LeagueShowGame } from '@/domain/league-show'
import { formatDateTime } from '@/domain/utils'
import { ApiErrorObject } from '@/types/errors'

const props = defineProps({
  game: {
    type: Object as PropType<Game | LeagueShowGame>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'success', value: string): void
  (e: 'loading', value: boolean): void
  (e: 'hide'): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const gameService = new GameService()

const selectedDate = ref<Date>(new Date(props.game.date || new Date()))
const errors = ref<ApiErrorObject>()
const loadingApi = ref<boolean>(false)

const handleSubmit = () => {
  if (!props.game) return

  if (!selectedDate.value) {
    errors.value = {
      date: [t('errors.required_field')],
    }
    toast.error(t('errors.correct_before_proceed'))
    return
  }

  if (
    props.game.date &&
    formatDateTime(selectedDate.value) === formatDateTime(props.game.date)
  ) {
    toast.error(t('errors.games.date_request.same_date'))
    return
  }

  if (
    props.game.date &&
    formatDateTime(selectedDate.value) === formatDateTime(props.game.date)
  ) {
    toast.error(t('errors.games.date_request.same_requested_date'))
    return
  }

  errors.value = undefined

  changeDate()
}

const changeDate = async () => {
  loadingApi.value = true
  const { data, error } = await gameService.changeDate(
    props.game.id,
    mapDateToApiGameRequestChangeDateRequest(selectedDate.value),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else if (data.value) {
    toast.success(t('games.date_request.changed'))
    emit('success', 'hola')
  }

  loadingApi.value = false
}

watch(
  () => props.game,
  () => {
    selectedDate.value = new Date(props.game.date || new Date())
  },
)

watch(loadingApi, value => {
  emit('loading', value)
})

defineExpose({
  handleSubmit,
  loadingApi,
  selectedDate,
})
</script>

<template>
  <form
    class="easy-game-change-date-form-component"
    @submit.prevent="handleSubmit"
  >
    <FormInputGroup>
      <Calendar
        v-model="selectedDate"
        class="w-full"
        inputId="calendar-game-date-input"
        :showTime="true"
        :stepMinute="15"
        inline
        :pt="{
          panel: {
            style: {
              filter: `grayscale(${loadingApi ? 1 : 0})`,
            },
          },
        }"
        @hide="emit('hide')"
      >
        <!-- <template v-if="hidden || inlineButton" #footer>
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
        </template> -->
      </Calendar>
      <!-- <Button
        v-if="!hidden && !inline"
        type="submit"
        :loading="loadingApi"
        :label="t('forms.save')"
        :disabled="loadingApi"
      /> -->
    </FormInputGroup>
  </form>
</template>

<script lang="ts">
export default {
  name: 'GameChangeDateForm',
}
</script>
