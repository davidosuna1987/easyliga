<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { VerifyData } from '@/stores/useAuthStore'

const route = useRoute()
const auth = useAuthStore()

const form = ref<VerifyData>({
  user: Number(route.params.user),
  token: String(route.params.token),
})

const handleVerify = async () => {
  const { error } = await auth.verify({
    user: form.value.user,
    token: form.value.token,
  })

  if (error.value) {
    console.log(error.value?.data?.errors)
  }
}
</script>

<template>
  <div class="easy-verify-page">
    <form @submit.prevent="handleVerify">
      <label>
        User
        <input v-model="form.user" type="text" />
      </label>
      <label>
        Token
        <input v-model="form.token" type="text" />
      </label>

      <button>Verify</button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
