<script setup lang="ts">
import { LeagueShowGame } from '@/domain/league-show'
import { Game, GameChangeDateFormRef } from '@/domain/game'

const props = defineProps({
  visible: {
    type: Boolean,
    required: false,
  },
  game: {
    type: Object as PropType<Game | LeagueShowGame>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'success', value: string): void
  (e: 'loading', value: boolean): void
  (e: 'hide', value: boolean): void
}>()

const { t } = useI18n()

const showDialog = ref<boolean>(!!props.visible)
const gameChangeDateFormRef = ref<GameChangeDateFormRef>()
const loading = ref<boolean>(false)

const handleFormSubmit = () => {
  gameChangeDateFormRef.value?.handleSubmit()
}

const handleLoading = (value: boolean) => {
  loading.value = value
}

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
)
</script>

<template>
  <DialogBottom
    class="easy-game-change-date-dialog-form-component"
    :visible="showDialog"
    @hide="emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ t('forms.change_date') }}</Heading>
    </template>

    <GameChangeDateForm
      ref="gameChangeDateFormRef"
      class="mt-6"
      :game="game"
      @loading="handleLoading"
      @success="emit('success', $event)"
      @date:changed="emit('hide', true)"
      @hide="emit('hide', true)"
    />

    <template #stickyFooter>
      <FormFooterActions
        :disabled="loading"
        @form:submit="handleFormSubmit"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'GameChangeDateDialogForm',
}
</script>
