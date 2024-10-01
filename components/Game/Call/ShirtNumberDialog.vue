<script setup lang="ts">
import { Player, getFullName } from '@/domain/player'
import { Call } from '@/domain/call'
import { TeamMember } from '@/domain/team'

const props = defineProps({
  player: {
    type: Object as PropType<Player | TeamMember>,
    default: null,
  },
  call: {
    type: Object as PropType<Call>,
    default: null,
  },
})

const emit = defineEmits(['update:player', 'hide'])

const { t } = useI18n()

const showDialog = ref<boolean>(!!props.player)
const shirtNumber = ref<number>(0)

const handleSubmit = () => {
  if (shirtNumber.value === 0) return
  emit('update:player', { ...props.player, shirtNumber: shirtNumber.value })
}

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
    <Heading tag="h6">{{ t('shirts.number_select') }}</Heading>
    <Message v-if="call" :closable="false" :icon="undefined">
      <small>{{ t('shirts.call_number_update_disclaimer') }}</small>
    </Message>

    <form class="flex justify-center items-center" @submit="handleSubmit">
      <InputNumber
        v-model="shirtNumber"
        buttonLayout="horizontal"
        showButtons
        class="mt-4"
        inputClass="text-4xl text-center w-[100px]"
        inputId="easy-game-call-shirt-number-dialog-input"
        :min="1"
        @keypress.enter.prevent="handleSubmit"
      >
        <template #incrementbuttonicon>
          <Icon name="ic:round-plus" />
        </template>
        <template #decrementbuttonicon>
          <Icon name="ic:round-minus" />
        </template>
      </InputNumber>
    </form>

    <template #stickyFooter>
      <FormFooterActions
        :submitLabel="t('shirts.number_change_short')"
        @form:submit="handleSubmit"
        hideCancel
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'GameCallShirtNumberDialog',
}
</script>
