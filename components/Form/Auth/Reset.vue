<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { ResetData } from '@/types/api/auth'
import { ApiErrorObject } from '@/types/errors'

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
  </FormAuthBase>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
export default {
  name: 'FormAuthReset',
}
</script>
