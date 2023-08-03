<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { LoginData } from '@/types/api/auth'
import { ApiErrorObject } from '@/types/errors'

const auth = useAuthStore()
const toast = useEasyToast()

const form = ref<LoginData>({
  email: '',
  password: '',
})

const errors = ref<ApiErrorObject | null>(null)

async function handleLogin() {
  const { error } = await auth.login(form.value)

  if (error.value) {
    if (error.value.data?.errors instanceof Array) {
      toast.error(error.value.data?.errors[0])
    } else {
      toast.correctErrors()
    }
    errors.value = error.value.data?.errors
  } else {
    auth.loginRedirect()
  }
}
</script>

<template>
  <FormAuthBase
    class="easy-form-auth-login"
    :buttonLabel="$t('auth.login')"
    @submitted="handleLogin"
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
    <Password
      input-id="password"
      v-model="form.password"
      toggle-mask
      :feedback="false"
    />

    <template #link>
      <NuxtLink class="text-end mb-3" to="/forgot">
        {{ $t('auth.forgot') }}
      </NuxtLink>
    </template>
  </FormAuthBase>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'FormAuthLogin',
}
</script>
