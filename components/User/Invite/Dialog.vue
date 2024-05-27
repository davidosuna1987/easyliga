<script setup lang="ts">
import { Role, ROLE_MAPPER } from '@/domain/role'
import { ApiErrorObject } from '@/types/errors'
import { ApiInviteRequest } from '@/types/api/user'
import UserService from '@/services/user'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: Array as PropType<Role[]>,
    default: [],
  },
})

const emit = defineEmits(['hide', 'selected'])

const toast = useEasyToast()
const userService = new UserService()
const { $i18n } = useNuxtApp()

const showDialog = ref<boolean>(props.visible)
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const form = ref<ApiInviteRequest>({
  email: '',
  roles: [...props.roles, ROLE_MAPPER['user']],
})

const handleSubmit = async () => {
  loadingApi.value = true
  const { error } = await userService.invite(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value.data?.errors
    loadingApi.value = false
  } else {
    toast.success($i18n.t('users.invited'))
    emit('hide', true)
  }
}

watch(
  () => props.visible,
  value => (showDialog.value = value),
)

watch(
  () => props.roles,
  value => (form.value.roles = value),
)
</script>

<template>
  <DialogBottom
    class="easy-user-invite-dialog-component"
    :visible="!!showDialog"
    @hide="emit('hide')"
  >
    <template #header>
      <Heading tag="h6">{{ $t('users.invite') }}</Heading>
    </template>

    <p class="mt-3">{{ $t('users.invite_dialog') }}</p>

    <div class="mt-2 flex gap-2">
      <Tag v-for="role in form.roles" :value="role" />
    </div>

    <div class="mt-6">
      <FormLabel :label="$t('forms.email')" :error="errors?.email?.[0]" />
      <InputText v-model="form.email" type="email" class="w-full" />
    </div>

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
          :label="$t('forms.invite')"
          :loading="loadingApi"
          @click="handleSubmit"
        />
      </div>
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'UserInviteDialog',
}
</script>
