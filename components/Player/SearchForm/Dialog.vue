<script setup lang="ts">
import { Player } from '@/domain/player'

const emit = defineEmits(['add', 'hide'])

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

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
      <Heading tag="h5">{{ $t('players.add') }}</Heading>
    </template>

    <PlayerSearchForm class="min-h-[200px]" full @selected="handleSelected" />

    <template #footer>
      <div class="flex justify-end gap-3 mt-3">
        <Button
          class="grayscale"
          :label="$t('forms.cancel')"
          severity="info"
          outlined
          @click="emit('hide', true)"
        />
        <Button
          :disabled="!selectedPlayer"
          class="mt-3"
          type="button"
          :label="$t('players.add')"
          :loading="false"
          @click="emit('add', selectedPlayer)"
        />
      </div>
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'PlayerSearchFormDialog',
}
</script>
