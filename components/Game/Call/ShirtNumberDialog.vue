<script setup lang="ts">
import { Player, getFullName } from '@/domain/player'

const props = defineProps({
  player: {
    type: Object as PropType<Player>,
    default: null,
  },
})

const showDialog = ref<boolean>(!!props.player)
const shirtNumber = ref<number>(0)

watch(
  () => props.player,
  value => {
    showDialog.value = !!value
    shirtNumber.value = value?.shirtNumber ?? 0
  },
)
</script>

<template>
  <DialogBottom
    class="easy-game-call-shirt-number-dialog-component"
    :visible="showDialog"
    @hide="$emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ getFullName(player) }}</Heading>
    </template>
    <Heading tag="h6">{{ $t('shirts.number_select') }}</Heading>
    <Message :closable="false" :icon="undefined">
      <small>{{ $t('shirts.call_number_update_disclaimer') }}</small>
    </Message>

    <div class="flex justify-center items-center">
      <InputNumber
        v-model="shirtNumber"
        buttonLayout="horizontal"
        showButtons
        class="mt-4"
        inputClass="text-4xl text-center w-[100px]"
        :min="1"
        @update:modelValue="$emit('update:player', { ...player, shirtNumber })"
      >
        <template #incrementbuttonicon>
          <Icon name="ic:round-plus" />
        </template>
        <template #decrementbuttonicon>
          <Icon name="ic:round-minus" />
        </template>
      </InputNumber>
    </div>

    <template #footer>
      <Button
        class="mt-3"
        type="button"
        :label="$t('shirts.number_change_short')"
        :loading="false"
        @click="$emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'GameCallShirtNumberDialog',
}
</script>
