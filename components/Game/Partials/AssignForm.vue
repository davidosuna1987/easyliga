<script setup lang="ts">
import GameService from '@/services/game'
import {
  Game,
  GamePartials,
  GamePartialsAssignRequest,
  mapGamePartialsAssignRequestToApiGamePartialsAssignRequest,
} from '@/domain/game'
import { TeamType } from '@/domain/team'
import { LeagueShowGame } from '@/domain/league-show'

const props = defineProps({
  game: {
    type: Object as PropType<Game | LeagueShowGame>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'partials:assigned', value: GamePartials): void
  (e: 'loading', value: boolean): void
}>()

const gameService = new GameService()

const { t } = useI18n()
const toast = useEasyToast()

const DEFAULT_PARTIALS_FORM: GamePartials = Array.from(
  { length: 5 },
  (_, i) => {
    const existingPartial = props.game.statistics?.partials?.[i]
    return {
      setNumber: (i + 1) as GamePartials[number]['setNumber'],
      localTeamScore: existingPartial?.localTeamScore,
      visitorTeamScore: existingPartial?.visitorTeamScore,
    }
  },
)

const form = ref<GamePartialsAssignRequest>({
  partials: DEFAULT_PARTIALS_FORM,
})
const loadingApi = ref(false)

const handleSubmit = async () => {
  if (!form.value.partials.length) return

  loadingApi.value = true

  const { error } = await gameService.assignPartials(
    props.game.id,
    mapGamePartialsAssignRequestToApiGamePartialsAssignRequest(form.value),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else {
    toast.success(t('games.partials.assigned'))
    emit('partials:assigned', form.value.partials)
  }

  loadingApi.value = false
}

watch(loadingApi, value => {
  emit('loading', value)
})

defineExpose({
  handleSubmit,
  loadingApi,
  form,
})
</script>

<template>
  <form class="easy-game-partials-assign-form-component">
    <div class="grid gap-3 grid-cols-[auto_1fr_1fr]">
      <p class="line-clamp-1 text-center">
        {{ t('sets.set') }}
      </p>
      <p class="line-clamp-1 text-center">
        {{ game.teamNames[TeamType.local] }}
      </p>
      <p class="line-clamp-1 text-center">
        {{ game.teamNames[TeamType.visitor] }}
      </p>

      <template v-for="partial in form.partials" :key="partial.setNumber">
        <p class="line-clamp-1 text-center place-self-center">
          {{ partial.setNumber }}
        </p>
        <InputNumber v-model="partial.localTeamScore" :min="0" />
        <InputNumber v-model="partial.visitorTeamScore" :min="0" />
      </template>
    </div>
  </form>
</template>

<script lang="ts">
export default {
  name: 'GamePartialsAssignForm',
}
</script>
