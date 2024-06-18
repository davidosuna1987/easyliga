<script setup lang="ts">
import { Player } from '@/domain/player'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'hide', value: boolean): void
  (e: 'add', value: Player): void
}>()

const { t } = useI18n()

const selectedPlayer = ref<Player>()
const showDialog = ref<boolean>(!!props.visible)

const handleSelected = (player: Player) => {
  selectedPlayer.value = player
}

const handleFormSubmit = () => {
  if (!selectedPlayer.value) return

  emit('add', selectedPlayer.value)
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
    class="easy-player-search-form-dialog-component"
    :visible="showDialog"
    @hide="$emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ t('players.add') }}</Heading>
    </template>

    <PlayerSearchForm
      class="min-h-[200px]"
      full
      @selected="handleSelected"
      @invited="emit('hide', true)"
    />

    <template #footer>
      <FormFooterActions
        :submitLabel="t('players.add')"
        :disabled="!selectedPlayer"
        @form:submit="handleFormSubmit"
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
