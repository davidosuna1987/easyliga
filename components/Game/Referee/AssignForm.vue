<script setup lang="ts">
import { Game, hasDefaultReferee } from '@/domain/game'
import { User, UserSearchFormInputRef } from '@/domain/user'
import { ROLE_MAPPER } from '@/domain/role'
import GameService from '@/services/game'
import { LeagueShowGame } from '@/domain/league-show'

const props = defineProps({
  game: {
    type: Object as PropType<Game | LeagueShowGame>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'referee:selected', value: User): void
  (e: 'referee:assigned', value: User): void
  (e: 'loading', value: boolean): void
}>()

const gameService = new GameService()

const { t } = useI18n()
const toast = useEasyToast()

const selectedReferee = ref<User | undefined>(props.game.referee)
const userSearchFormInputRef = ref<UserSearchFormInputRef>()
const loadingApi = ref(false)

const userSearchFormInputLabel = computed(() => {
  if (userSearchFormInputRef.value?.userChanged) {
    return t('games.referee.assign')
  }

  return userSearchFormInputRef.value?.editingUser ||
    (!readonly && !selectedReferee.value?.profile)
    ? t('referees.search')
    : t('games.referee.game')
})

const userOriginal = computed((): User | undefined =>
  hasDefaultReferee(props.game) ? undefined : props.game.referee,
)

const handleSubmit = async () => {
  if (!selectedReferee.value) return

  if (selectedReferee.value.id === props.game.referee?.id) {
    toast.success(t('games.referee.assigned'))
    emit('referee:assigned', selectedReferee.value)
    return
  }

  loadingApi.value = true

  const { data, error } = await gameService.addReferee(
    props.game.id,
    selectedReferee.value.id,
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else {
    toast.success(t('games.referee.assigned'))
    emit('referee:assigned', selectedReferee.value)
  }

  loadingApi.value = false
}

const handleRefereeSelected = (referee: User) => {
  selectedReferee.value = referee
  emit('referee:selected', referee)
}

const stopEditingReferee = (cancel = false) => {
  if (cancel && props.game?.referee) {
    handleRefereeSelected(props.game.referee)
  }

  if (
    userSearchFormInputRef.value?.editingUser &&
    !userSearchFormInputRef.value?.userChanged
  ) {
    userSearchFormInputRef.value?.stopEditing()
  }
}

watch(loadingApi, value => {
  emit('loading', value)
})

defineExpose({
  handleSubmit,
  loadingApi,
  selectedReferee,
})
</script>

<template>
  <form class="easy-game-referee-assign-form-component">
    <UserSearchFormInput
      ref="userSearchFormInputRef"
      :userOriginal="userOriginal"
      :userSelected="selectedReferee"
      :invitedToId="props.game?.id"
      :whereRole="ROLE_MAPPER.referee"
      :label="userSearchFormInputLabel"
      @selected="handleRefereeSelected"
      @invited="stopEditingReferee(true)"
      @cancel="stopEditingReferee(true)"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'GameRefereeAssignForm',
}
</script>
