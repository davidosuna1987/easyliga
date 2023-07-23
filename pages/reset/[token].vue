<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { ResetData } from '@/stores/useAuthStore'

const route = useRoute()
const auth = useAuthStore()

const form = ref<ResetData>({
  email: 'david@beeffic.com',
  token: String(route.params.token),
  password: 'password',
  password_confirm: 'password',
})

const handleReset = async () => {
  const { error } = await auth.reset({
    email: form.value.email,
    token: form.value.token,
    password: form.value.password,
    password_confirm: form.value.password_confirm,
  })

  if (error.value) {
    console.log(error.value?.data?.errors)
  }
}
</script>

<template>
  <div class="easy-reset-page">
    <form @submit.prevent="handleReset">
      <label>
        Email
        <input v-model="form.email" type="email" />
      </label>
      <label>
        Token
        <input v-model="form.token" type="text" />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" />
      </label>
      <label>
        Password Confirm
        <input v-model="form.password_confirm" type="password" />
      </label>

      <button>Reset</button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
