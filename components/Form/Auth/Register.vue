<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiRegisterRequest } from '@/types/api/auth'
import { ApiErrorObject } from '@/types/errors'

const auth = useAuthStore()
const toast = useEasyToast()

const form = ref<ApiRegisterRequest>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirm: '',
})

const loadingApi = ref<boolean>(false)

const errors = ref<ApiErrorObject | null>(null)

async function handleRegister() {
  loadingApi.value = true
  const { data, error } = await auth.register(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value.data?.errors
    loadingApi.value = false
  } else {
    if (data.value) toast.success(data.value.data.message)
    navigateTo('/login')
  }
}
</script>

<template>
  <FormAuthBase
    class="easy-form-auth-register"
    :buttonLabel="$t('auth.register')"
    :loading="loadingApi"
    @submit="handleRegister"
  >
    <FormLabel
      for="first_name"
      :label="$t('forms.name')"
      :error="errors?.first_name?.[0]"
    />
    <InputText id="first_name" v-model="form.first_name" type="text" />

    <FormLabel
      for="last_name"
      :label="$t('forms.surnames')"
      :error="errors?.last_name?.[0]"
    />
    <InputText id="last_name" v-model="form.last_name" type="text" />

    <FormLabel
      for="email"
      :label="$t('forms.email')"
      :error="errors?.email?.[0]"
    />
    <InputText id="email" v-model="form.email" type="email" />

    <FormLabel
      for="password"
      :label="$t('forms.password')"
      :error="errors?.password?.[0]"
    />
    <Password input-id="password" v-model="form.password" toggleMask />

    <FormLabel
      for="password_confirm"
      :label="$t('forms.password_confirm')"
      :error="errors?.password_confirm?.[0]"
    />
    <Password
      input-id="password_confirm"
      v-model="form.password_confirm"
      toggle-mask
      :feedback="false"
    />
  </FormAuthBase>
</template>

<script lang="ts">
export default {
  name: 'FormAuthRegister',
}
</script>
