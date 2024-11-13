<script setup lang="ts">
import { InvitedRole, InvitedToType } from '@/domain/invite'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: Array as PropType<Array<InvitedRole | 'user'>>,
    default: ['user'],
  },
  invitedToType: {
    type: String as PropType<InvitedToType>,
    required: false,
  },
  invitedToId: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'hide', value: boolean): void
  (e: 'invited', value: boolean): void
}>()

const { t } = useI18n()

const showDialog = ref<boolean>(props.visible)
const loadingApi = ref<boolean>(false)

watch(
  () => props.visible,
  value => (showDialog.value = value),
)
</script>

<template>
  <DialogBottom
    class="easy-user-invite-dialog-component"
    :visible="!!showDialog"
    @hide="emit('hide', true)"
  >
    <template #header>
      <Heading tag="h6">{{ t('users.invite') }}</Heading>
    </template>

    <UserInviteForm
      :invitedToType="invitedToType"
      :invitedToId="invitedToId"
      :roles="roles"
    />

    <template #stickyFooter>
      <FormFooterActions
        :submitLabel="t('forms.invite')"
        :disabled="loadingApi"
        @form:submit="easyEmit('user-invite:submit')"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'UserInviteDialog',
}
</script>
