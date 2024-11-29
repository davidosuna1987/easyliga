<script setup lang="ts">
import { Game, GamePartialsAssignFormRef } from '@/domain/game'
import { LeagueShowGame } from '@/domain/league-show'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  game: {
    type: Object as PropType<Game | LeagueShowGame>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'hide', value: boolean): void
  (e: 'partials:assigned'): void
}>()

const { t } = useI18n()

const gamePartialsAssignFormRef = ref<GamePartialsAssignFormRef>()
const showDialog = ref<boolean>(props.visible)
const formLoading = ref<boolean>(false)

const handleFormSubmit = () => {
  gamePartialsAssignFormRef.value?.handleSubmit()
}

const handlePartialsAssigned = () => {
  formLoading.value = false
  emit('partials:assigned')
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
    class="easy-game-partials-assign-form-dialog-component"
    :visible="!!showDialog"
    @hide="emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ t('games.partials.assign') }}</Heading>
    </template>

    <GamePartialsAssignForm
      ref="gamePartialsAssignFormRef"
      class="mt-6"
      :game="game"
      dialog
      @partials:assigned="handlePartialsAssigned"
      @loading="formLoading = $event"
      @hide="emit('hide', true)"
    />

    <template #stickyFooter>
      <FormFooterActions
        class="mt-10"
        :loading="formLoading"
        :submitLabel="t('games.partials.assign')"
        @form:submit="handleFormSubmit"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'GamePartialsAssignFormDialog',
}
</script>
