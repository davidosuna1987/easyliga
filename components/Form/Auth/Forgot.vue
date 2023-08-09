<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { ForgotData } from '@/types/api/auth'
import { ApiErrorObject } from '@/types/errors'

const auth = useAuthStore()
const toast = useEasyToast()

const form = ref<ForgotData>({
  email: '',
})

const errors = ref<ApiErrorObject | null>(null)

async function handleForgot() {
  const { data, error } = await auth.forgot(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value.data?.errors
  } else {
    if (data.value) toast.info(data.value.data.message)
    navigateTo('/login')
  }
}
</script>

<template>
  <FormAuthBase
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
  </FormAuthBase>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'FormAuthForgot',
}
</script>
