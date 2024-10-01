<script setup lang="ts">
import { Game, GameRefereeAssignFormRef } from '@/domain/game'
import { User } from '@/domain/user'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'hide', value: boolean): void
  (e: 'referee:selected', value: User): void
  (e: 'referee:assigned', value: User): void
}>()

const { t } = useI18n()

const gameRefereeAssignFormRef = ref<GameRefereeAssignFormRef>()
const showDialog = ref<boolean>(props.visible)
const formLoading = ref<boolean>(false)

const handleFormSubmit = () => {
  gameRefereeAssignFormRef.value?.handleSubmit()
}

const handleRefereeSelected = (user: User) => {
  emit('referee:selected', user)
}

const handleRefereeAssigned = (user: User) => {
  formLoading.value = false
  emit('referee:assigned', user)
}

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
  { immediate: true },
)
</script>

<template>
  <DialogBottom
    class="easy-game-referee-assign-form-dialog-component"
    :visible="!!showDialog"
    @hide="emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ game.name }}</Heading>
    </template>

    <GameRefereeAssignForm
      ref="gameRefereeAssignFormRef"
      class="mt-6"
      :game="game"
      dialog
      @referee:selected="handleRefereeSelected"
      @referee:assigned="handleRefereeAssigned"
      @loading="formLoading = $event"
      @hide="emit('hide', true)"
    />

    <template #stickyFooter>
      <FormFooterActions
        class="mt-10"
        :loading="formLoading"
        :submitLabel="t('referees.assign')"
        @form:submit="handleFormSubmit"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'GameRefereeAssignFormDialog',
}
</script>
