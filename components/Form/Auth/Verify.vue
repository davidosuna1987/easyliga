<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { VerifyData } from '@/stores/useAuthStore'
import { ApiErrorObject } from 'types/errors'

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
    if (error.value.data?.errors instanceof Array) {
      toast.error(error.value.data?.errors[0])
    } else {
      toast.correctErrors()
    }
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
types/errors
