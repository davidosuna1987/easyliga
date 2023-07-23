<script lang="ts" setup>
import { LoginData, useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

const form = ref<LoginData>({
  email: 'david@beeffic.com',
  password: 'secret',
})

async function handleLogin() {
  const { data, error } = await auth.login(form.value)

  if (error.value) {
    console.info(error.value?.data?.errors)
  } else {
    navigateTo('/')
  }
}
</script>

<template>
  <div class="easy-login-page">
    <form @submit.prevent="handleLogin">
      <label>
        Email
        <input v-model="form.email" type="email" />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" />
      </label>

      <button>Login</button>
    </form>
  </div>
</template>

<style scoped></style>
