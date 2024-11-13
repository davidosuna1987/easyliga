<script setup lang="ts">
import { InvitedRole, InvitedToType } from '@/domain/invite'
import { ApiErrorObject } from '@/types/errors'
import { ApiInviteRequest } from '@/types/api/invite'
import UserService from '@/services/user'

const props = defineProps({
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
  hideMessage: {
    type: Boolean,
    default: false,
  },
  hideRoles: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'invited', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()
const userService = new UserService()

const errors = ref<ApiErrorObject>()
const form = ref<ApiInviteRequest>({
  email: '',
  roles: [...props.roles],
  invited_to_type: props.invitedToType ?? null,
  invited_to_id: props.invitedToId ?? null,
})

const clearErrors = () => {
  errors.value = undefined
}

const handleSubmit = async () => {
  easyEmit('user-invite:loading', true)

  const { error } = await userService.invite(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value.data?.errors
  } else {
    form.value.email = ''
    toast.success(t('users.invited'))
    emit('invited', true)
  }

  easyEmit('user-invite:loading', false)
}

watch(
  () => props.roles,
  value => (form.value.roles = value),
)

watch(form.value, () => clearErrors(), { deep: true })

onMounted(() => {
  easyListen('user-invite:submit', handleSubmit)
})

onUnmounted(() => {
  easyUnlisten('user-invite:submit')
})
</script>

<template>
  <form class="easy-user-invite-form-component" @submit.prevent="handleSubmit">
    <p v-if="!hideMessage" class="mt-3">{{ t('users.invite_dialog') }}</p>

    <div v-if="!hideRoles" class="mt-2 flex gap-2">
      <Tag v-for="role in form.roles" :value="t(`roles.type.${role}`)" />
    </div>

    <FormLabel
      class="mt-6"
      :label="t('forms.email')"
      :error="errors?.email?.[0]"
    />
    <InputText v-model="form.email" type="email" class="w-full" />
  </form>
</template>

<script lang="ts">
export default {
  name: 'UserInviteForm',
}
</script>
