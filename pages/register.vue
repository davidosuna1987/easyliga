<script lang="ts" setup>
import { RegisterData, useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

const form = ref<RegisterData>({
  email: 'bperez@beeffic.com',
  password: 'secret',
  password_confirm: 'secret',
})

async function handleRegister() {
  const { data, error } = await auth.register(form.value)

  if (error.value) {
    console.info(error.value?.data?.errors)
  }
}
</script>

<template>
  <div class="easy-register-page">
    <form @submit.prevent="handleRegister">
      <label>
        Email
        <input v-model="form.email" type="email" />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" />
      </label>
      <label>
        Password confirmation
        <input v-model="form.password_confirm" type="password" />
      </label>

      <button>Register</button>
    </form>
  </div>
</template>

<style scoped></style>
