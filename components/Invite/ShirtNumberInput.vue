<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { Invite, invitedAsPlayer } from '@/domain/invite'

const props = defineProps({
  invite: {
    type: Object as PropType<Invite>,
    required: true,
  },
  error: {
    type: String,
    required: false,
  },
  showDisclaimer: {
    type: Boolean,
    default: false,
  },
  showUnavailable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'shirtNumber:changed', value: number): void
}>()

const { t } = useI18n()
const auth = useAuthStore()
const toast = useEasyToast()

const selectedShirtNumber = ref<number>()
const showUnavailableShirtNumbersDialog = ref<boolean>(false)

const showUnavailableShirtNumbers = computed(
  () => !!props.invite.unavailableShirtNumbers?.length && props.showUnavailable,
)

const handleShirtNumberChanged = (value: number) => {
  selectedShirtNumber.value = value
  if (value) emit('shirtNumber:changed', value)
}

const isShirtNumberTaken = (): boolean => {
  if (
    !!props.invite.unavailableShirtNumbers?.length &&
    selectedShirtNumber.value &&
    props.invite.unavailableShirtNumbers.includes(selectedShirtNumber.value)
  ) {
    toast.error(
      t('players.shirt_number_taken', {
        shirtNumber: selectedShirtNumber.value,
      }),
    )
    return true
  }

  return false
}

defineExpose({
  isShirtNumberTaken,
})
</script>

<template>
  <aside class="easy-invite-shirt-number-input-component">
    <Message
      v-if="showDisclaimer || auth.isLoggedIn"
      severity="primary"
      class="mb-5 relative bottom-3"
      :closable="false"
      :pt="{
        icon: {
          style: {
            display: 'none',
          },
        },
      }"
    >
      <p v-if="auth.isLoggedIn" class="mb-3">
        <span
          v-html="
            t('invites.invited_by', {
              teamName: invite?.invitedTo?.name,
              roles: invite?.emailRoleNames,
            })
          "
        ></span>
      </p>
      <p v-if="showDisclaimer">
        {{ t('invites.show_unavailable_shirt_numbers') }}
      </p>
    </Message>

    <FormLabel
      for="shirt_number"
      :label="t('shirts.number_select')"
      :error="error"
      required
    >
      <InputNumber
        id="shirt_number"
        v-model="selectedShirtNumber"
        showButtons
        buttonLayout="horizontal"
        :min="1"
        :max="999"
        @update:modelValue="handleShirtNumberChanged"
      />
    </FormLabel>

    <div v-if="showUnavailableShirtNumbers" class="flex justify-end mt-3">
      <a
        class="cursor-pointer"
        @click="showUnavailableShirtNumbersDialog = true"
      >
        {{ t('shirts.show_unavailable') }}
      </a>
    </div>

    <DialogBottom
      v-if="showUnavailableShirtNumbers"
      class="easy-unavailable-shirt-numbers-dialog-component"
      :visible="showUnavailableShirtNumbersDialog"
      @hide="showUnavailableShirtNumbersDialog = false"
    >
      <template #header>
        <Heading tag="h6">{{ t('shirts.unavailable') }}</Heading>
      </template>

      <div class="flex gap-3 justify-center flex-wrap mt-5">
        <IconShirtNumber
          v-for="shirtNumber in invite.unavailableShirtNumbers"
          :shirtNumber="shirtNumber"
          size="lg"
          isIcon
        />
      </div>
    </DialogBottom>
  </aside>
</template>

<script lang="ts">
export default {
  name: 'InviteShirtNumberInput',
}
</script>
