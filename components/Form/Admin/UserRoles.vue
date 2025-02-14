<script setup lang="ts">
import { User } from '@/domain/user'
import { Role, ROLES } from '@/domain/role'
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiLoginAsRequest } from '@/types/api/auth'

const auth = useAuthStore()
const toast = useEasyToast()

const loadingApi = ref(false)
const selectedUser = ref<User>()
const selectedRoles = ref<Role[]>([])

const handleUserSelected = (user: User) => {
  selectedUser.value = user
  selectedRoles.value = user.roles || []
}

const toggleRole = (role: Role) => {
  if (!selectedUser.value) return

  if (selectedRoles.value.includes(role)) {
    selectedRoles.value = selectedRoles.value.filter(r => r !== role)
  } else {
    selectedRoles.value = [...selectedRoles.value, role]
  }
}
</script>

<template>
  <div
    v-if="auth.isAdminOrHasRole('staff')"
    class="easy-form-admin-user-roles-component"
  >
    <UserSearchForm @selected="handleUserSelected" :with="['roles']" full />
    <div v-if="selectedUser" class="mt-4 flex flex-wrap gap-1">
      <Badge
        v-for="role of ROLES"
        :class="[
          'role-badge',
          'cursor-pointer',
          '[--badge-text-color:var(--text-color)]',
          ' dark:[--badge-text-color:white]',
          { 'is-selected': selectedRoles.includes(role) },
        ]"
        :value="role"
        @click="toggleRole(role)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.role-badge {
  background-color: transparent !important;
  border: solid 1px var(--primary-color);
  font-weight: normal;
  height: 14px;
  padding: 0px 5px;
  line-height: 1.05;
  color: var(--badge-text-color);

  &.is-selected {
    background-color: var(--primary-color) !important;
    color: var(--primary-color-text);
  }
}
</style>

<script lang="ts">
export default {
  name: 'FormAuthUserRoles',
}
</script>
