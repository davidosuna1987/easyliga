<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { ResetData } from '@/stores/useAuthStore'
import { ApiErrorObject } from 'domain/errors'

const route = useRoute()
const auth = useAuthStore()
const toast = useEasyToast()

const form = ref<ResetData>({
  email: '',
  token: String(route.params.token),
  password: '',
  password_confirm: '',
})

const errors = ref<ApiErrorObject | null>(null)

const handleReset = async () => {
  const { data, error } = await auth.reset(form.value)

  if (error.value) {
    if (error.value.data?.errors instanceof Array) {
      toast.error(error.value.data?.errors[0])
    } else {
      toast.correctErrors()
    }
    errors.value = error.value.data?.errors
  } else {
    if (data.value) toast.info(data.value.data.message)
    navigateTo('/login')
  }
}
</script>

<template>
  <FormAuth
    class="easy-form-auth-reset"
    :buttonLabel="$t('auth.reset')"
    @submit="handleReset"
  >
    <FormLabel
      for="email"
      :label="$t('forms.email')"
      :error="errors?.email?.[0]"
    />
    <InputText id="email" v-model="form.email" type="email" />

    <FormLabel
      for="token"
      :label="$t('forms.token')"
      :error="errors?.token?.[0]"
    />
    <InputText id="token" v-model="form.token" type="string" disabled />

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

<style lang="scss" scoped></style>
