<script lang="ts" setup>
import { ForgotData, useAuthStore } from '@/stores/useAuthStore'
import { ApiErrorObject } from 'domain/errors'

const auth = useAuthStore()
const toast = useEasyToast()

const form = ref<ForgotData>({
  email: '',
})

const errors = ref<ApiErrorObject | null>(null)

async function handleForgot() {
  const { data, error } = await auth.forgot(form.value)

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
    class="easy-form-auth-forgot"
    :buttonLabel="$t('auth.forgot')"
    @submitted="handleForgot"
  >
    <FormLabel
      for="email"
      :label="$t('forms.email')"
      :error="errors?.email?.[0]"
    />
    <InputText id="email" v-model="form.email" type="email" />
  </FormAuth>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'FormAuthForgot',
}
</script>
