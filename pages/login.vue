<script lang="ts" setup>
import { LoginData, useAuthStore } from '@/stores/useAuthStore'

const { errors, setShow, setErrors } = useErrors()

const auth = useAuthStore()

const form = ref<LoginData>({
  email: 'david@beeffic.com',
  password: 'secret',
})

async function handleLogin() {
  const { data, error } = await auth.login(form.value)

  if (error.value) {
    setErrors(error.value.data?.errors)
  } else {
    navigateTo('/')
  }
}
</script>

<template>
  <div class="easy-login-page">
    <pre>{{ errors }}</pre>
    <form @submit.prevent="handleLogin">
      <label>
        Email
        <input v-model="form.email" type="email" />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" />
      </label>

      <ErrorDialog
        :visible="errors.show"
        :errors="errors.list"
        @hide="setShow(false)"
      />

      <button>Login</button>
    </form>
  </div>
</template>

<style scoped></style>
