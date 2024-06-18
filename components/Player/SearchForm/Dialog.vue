<script setup lang="ts">
import { Player } from '@/domain/player'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
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
  (e: 'hide', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const selectedPlayer = ref<Player>()
const showDialog = ref<boolean>(!!props.visible)

const handleSelected = (player: Player) => {
  selectedPlayer.value = player
}

const handleFormSubmit = () => {
  if (!selectedPlayer.value) return

  if (selectedPlayer.value.shirtNumber === 0) {
    toast.error(t('errors.shirt_number_no_zero'))
    return
  }

  emit('player:add', selectedPlayer.value)
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
      class="mt-5"
      :unavailableShirtNumbers="unavailableShirtNumbers"
      full
      @selected="handleSelected"
      @invited="emit('hide', true)"
    />

    <template #footer>
      <FormFooterActions
        :submitLabel="t('players.add')"
        :disabled="!selectedPlayer || loading"
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
