<script lang="ts" setup>
import { ForgotData, useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

const form = ref<ForgotData>({
  email: 'david@beeffic.com',
})

async function handleForgot() {
  const { data, error } = await auth.forgot(form.value)

  if (error.value) {
    console.info(error.value?.data?.errors)
  }
}
</script>

<template>
  <div class="easy-forgot-page">
    <form @submit.prevent="handleForgot">
      <label>
        Email
        <input v-model="form.email" type="email" />
      </label>

      <button>Forgot</button>
    </form>
  </div>
</template>

<style scoped></style>
