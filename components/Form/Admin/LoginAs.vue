<script setup lang="ts">
import { User } from '@/domain/user'
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiLoginAsRequest } from '@/types/api/auth'

const auth = useAuthStore()
const toast = useEasyToast()

const loadingApi = ref(false)
const form = ref<ApiLoginAsRequest>({
  user_id: 0,
})

const handleUserSelected = (user: User) => {
  form.value.user_id = user.id
  handleLoginAs()
}

const handleLoginAs = async () => {
  loadingApi.value = true
  const { error } = await auth.loginAs(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    loadingApi.value = false
  } else {
    auth.loginRedirect()
  }
}
</script>

<template>
  <div v-role="['admin', 'staff']" class="easy-form-admin-loginas">
    <UserSearchForm @selected="handleUserSelected" full />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FormAuthLoginAs',
}
</script>
