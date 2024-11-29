<script setup lang="ts">
import LeagueService from '@/services/league'
import {
  League,
  CreateMatchdaysGamesRequest,
  mapCreateMatchdaysGamesRequestToApiCreateMatchdaysGamesRequest,
} from '@/domain/league'
import { LeagueShow } from '@/domain/league-show'
import { ApiErrorObject } from '@/types/errors'

const props = defineProps({
  league: {
    type: Object as PropType<League | LeagueShow>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'matchdays:generated', value: boolean): void
  (e: 'loading', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()
const leagueService = new LeagueService()

const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const form = ref<CreateMatchdaysGamesRequest>({
  start: undefined,
})

const handleSubmit = async () => {
  if (!form.value.start) {
    errors.value = {
      start: [t('errors.required_field')],
    }
    toast.error(t('errors.correct_before_proceed'))
    return
  }

  errors.value = null

  loadingApi.value = true
  const { data, error } = await leagueService.createMatchdaysGames(
    props.league.id,
    mapCreateMatchdaysGamesRequestToApiCreateMatchdaysGamesRequest(form.value),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else if (data.value) {
    emit('matchdays:generated', true)
  }
}

watch(
  () => loadingApi.value,
  value => {
    emit('loading', value)
  },
)

defineExpose({
  handleSubmit,
  loadingApi,
})
</script>

<template>
  <form
    class="easy-league-matchdays-form-component"
    @submit.prevent="handleSubmit"
  >
    <LoadingLabel
      v-if="loadingApi"
      class="justify-center h-[57.3px]"
      :label="t('games.generating')"
    />
    <FormLabel
      v-else
      :label="t('leagues.start_date')"
      :error="errors?.start?.[0]"
      required
    >
      <Calendar
        v-model="form.start"
        class="w-full"
        :minDate="new Date()"
        :touchUI="true"
        :disabledDays="[1, 2, 3, 4, 5, 0]"
        :disabled="loadingApi"
      />
    </FormLabel>
  </form>
</template>

<script lang="ts">
export default {
  name: 'LeagueMatchdaysForm',
}
</script>
