<script lang="ts" setup>
import { RegisterData, useAuthStore } from '@/stores/useAuthStore'
import { ApiErrorObject } from 'types/errors'

const auth = useAuthStore()
const toast = useEasyToast()

const form = ref<RegisterData>({
  email: '',
  password: '',
  password_confirm: '',
})

const errors = ref<ApiErrorObject | null>(null)

async function handleRegister() {
  const { data, error } = await auth.register(form.value)

  if (error.value) {
    if (error.value.data?.errors instanceof Array) {
      toast.error(error.value.data?.errors[0])
    } else {
      toast.correctErrors()
    }
    errors.value = error.value.data?.errors
  } else {
    if (data.value) toast.success(data.value.data.message)
    navigateTo('/login')
  }
}
</script>

<template>
  <FormAuth
    class="easy-form-auth-register"
    :buttonLabel="$t('auth.register')"
    @submit="handleRegister"
  >
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
  </FormAuth>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'FormAuthRegister',
}
</script>
types/errors
