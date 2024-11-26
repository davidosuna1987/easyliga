<script setup lang="ts">
import { Player, PlayerStoreRequest } from '@/domain/player'
import { ADD_USER_STEPS, AddUserStep } from '@/domain/user'
import { Team } from '@/domain/team'
import { ROLE_TO_INVITED_TO_TYPE_MAPPER } from '@/domain/invite'
import { ROLE_MAPPER } from '@/domain/role'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  unavailableShirtNumbers: {
    type: Array as PropType<number[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'player:add', value: Player): void
  (e: 'player:create', value: PlayerStoreRequest): void
  (e: 'hide', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const selectedPlayer = ref<Player>()
const playerStoreRequest = ref<PlayerStoreRequest>()
const showDialog = ref<boolean>(!!props.visible)
const isLoading = ref<boolean>(props.loading)

const step = ref<AddUserStep>(ADD_USER_STEPS.search)

const submitLabel = computed(() => {
  switch (step.value) {
    case ADD_USER_STEPS.search:
      return t('players.add')
    case ADD_USER_STEPS.invite:
      return t('players.invite')
    case ADD_USER_STEPS.create:
      return t('players.create')
  }
})

const submitDisabled = computed(() => {
  switch (step.value) {
    // case ADD_PLAYER_STEPS.search:
    //   return !selectedPlayer.value || isLoading.value
    default:
      return isLoading.value
  }
})

const tabItems = computed(() => [
  {
    key: ADD_USER_STEPS.search,
    label: t('forms.search'),
  },
  {
    key: ADD_USER_STEPS.invite,
    label: t('forms.invite'),
  },
  {
    key: ADD_USER_STEPS.create,
    label: t('forms.create'),
  },
])

const handleSelected = (player: Player) => {
  selectedPlayer.value = player
}

const handleUserInvited = () => {
  step.value = ADD_USER_STEPS.search
  emit('hide', true)
}

const handleSubmitClick = () => {
  switch (step.value) {
    case ADD_USER_STEPS.search:
      handleAddPlayer()
      break
    case ADD_USER_STEPS.invite:
      easyEmit('user-invite:submit')
      break
    case ADD_USER_STEPS.create:
      handleCreatePlayer()
      break
  }
}

const handleAddPlayer = () => {
  if (!selectedPlayer.value) {
    toast.error(t('errors.players.must_select_player'))
    return
  }

  if (selectedPlayer.value.shirtNumber === 0) {
    toast.error(t('errors.shirt_number_no_zero'))
    return
  }

  emit('player:add', selectedPlayer.value)
}

const handleCreatePlayer = () => {
  if (!playerStoreRequest.value) {
    toast.error(t('errors.fill_all_fields'))
    return
  }

  if (playerStoreRequest.value.shirtNumber === 0) {
    toast.error(t('errors.shirt_number_no_zero'))
    return
  }

  emit('player:create', playerStoreRequest.value)
}

const handleTabChanged = (key: string) => {
  step.value = key as AddUserStep
}

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
)

onMounted(() => {
  easyListen('user-invite:loading', value => {
    isLoading.value = value
  })
})
</script>

<template>
  <DialogBottom
    class="easy-player-search-form-dialog-component"
    :visible="showDialog"
    @hide="$emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ t('players.add') }}</Heading>
    </template>

    <EasyTabs class="mt-3" :items="tabItems" @tab:changed="handleTabChanged" />

    <div class="mt-5">
      <PlayerSearchForm
        v-if="step === ADD_USER_STEPS.search"
        :team="team"
        :unavailableShirtNumbers="unavailableShirtNumbers"
        full
        @selected="handleSelected"
        @invited="handleUserInvited"
      />

      <UserInviteForm
        v-else-if="step === ADD_USER_STEPS.invite"
        :invitedToType="ROLE_TO_INVITED_TO_TYPE_MAPPER[ROLE_MAPPER.player]"
        :invitedToId="team.id"
        :roles="[ROLE_MAPPER.player]"
        @invited="handleUserInvited"
      />

      <div v-else-if="step === ADD_USER_STEPS.create">
        <PlayerForm
          :unavailableShirtNumbers="unavailableShirtNumbers"
          @form:change="playerStoreRequest = $event"
        />
      </div>
    </div>

    <template #stickyFooter>
      <FormFooterActions
        :submitLabel="submitLabel"
        :disabled="submitDisabled"
        @form:submit="handleSubmitClick"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'PlayerSearchFormDialog',
}
</script>
