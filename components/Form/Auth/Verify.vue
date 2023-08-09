<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { VerifyData } from '@/types/api/auth'
import { ApiErrorObject } from '@/types/errors'

const route = useRoute()
const auth = useAuthStore()
const toast = useEasyToast()

const form = ref<VerifyData>({
  user: Number(route.params.user),
  token: String(route.params.token),
})

const errors = ref<ApiErrorObject | null>(null)

const handleVerify = async () => {
  const { data, error } = await auth.verify(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value.data?.errors
  } else {
    if (data.value) toast.success(data.value.data.message)
  }
  navigateTo('/')
}

handleVerify()
</script>

<template></template>

<style lang="scss" scoped></style>

<script lang="ts">
export default {
  name: 'FormAuthVerify',
}
</script>
