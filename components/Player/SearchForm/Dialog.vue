<script setup lang="ts">
import { Player } from '@/domain/player'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['add', 'hide'])

const { t } = useI18n()

const selectedPlayer = ref<Player>()
const showDialog = ref<boolean>(!!props.visible)

const handleSelected = (player: Player) => {
  selectedPlayer.value = player
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

    <PlayerSearchForm class="min-h-[200px]" full @selected="handleSelected" />

    <template #footer>
      <FormFooterActions
        :submitLabel="t('players.add')"
        :disabled="!selectedPlayer"
        @form:submit="emit('add', selectedPlayer)"
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
