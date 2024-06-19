<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiResetRequest } from '@/types/api/auth'
import { ApiErrorObject } from '@/types/errors'

const { t } = useI18n()
const route = useRoute()
const auth = useAuthStore()
const toast = useEasyToast()

const form = ref<ApiResetRequest>({
  email: '',
  token: String(route.params.token),
  password: '',
  password_confirm: '',
})

const loadingApi = ref<boolean>(false)

const errors = ref<ApiErrorObject | null>(null)

const handleReset = async () => {
  loadingApi.value = true
  const { data, error } = await auth.reset(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value.data?.errors
    loadingApi.value = false
  } else {
    if (data.value) toast.info(data.value.data.message)
    navigateTo('/login')
  }
}
</script>

<template>
  <FormAuthBase
    class="easy-form-auth-reset"
    :buttonLabel="t('auth.reset')"
    :loading="loadingApi"
    @submit="handleReset"
  >
    <FormLabel
      for="email"
      :label="t('forms.email')"
      :error="errors?.email?.[0]"
      required
    >
      <InputText id="email" v-model="form.email" type="email" />
    </FormLabel>

    <FormLabel
      for="token"
      :label="t('forms.token')"
      :error="errors?.token?.[0]"
      required
    >
      <InputText id="token" v-model="form.token" type="string" disabled />
    </FormLabel>

    <FormLabel
      for="password"
      :label="t('forms.password')"
      :error="errors?.password?.[0]"
      required
    >
      <Password input-id="password" v-model="form.password" toggleMask />
    </FormLabel>

    <FormLabel
      for="password_confirm"
      :label="t('forms.password_confirm')"
      :error="errors?.password_confirm?.[0]"
      required
    >
      <Password
        input-id="password_confirm"
        v-model="form.password_confirm"
        toggle-mask
        :feedback="false"
      />
    </FormLabel>
  </FormAuthBase>
</template>

<script lang="ts">
export default {
  name: 'FormAuthReset',
}
</script>
