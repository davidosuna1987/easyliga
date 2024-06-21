<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiAddRolesRequest } from '@/types/api/invite'
import { Invite, mapApiInviteToInvite } from '@/domain/invite'
import { Role } from '@/domain/role'
import InviteService from '@/services/invite'

const props = defineProps({
  inviteId: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()
const auth = useAuthStore()
const toast = useEasyToast()
const inviteService = new InviteService()

const form = ref<ApiAddRolesRequest>({
  roles: [],
})

const invite = ref<Invite>()
const loadingApi = ref<boolean>(false)

const getInvite = async () => {
  loadingApi.value = true

  const { data, error } = await inviteService.get(props.inviteId, props.code, {
    set_appends: 'role_names',
  })
  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    navigateTo('/')
  } else if (data.value) {
    invite.value = mapApiInviteToInvite(data.value.data.invite)
    form.value.roles = invite.value.roles.split(',') as Role[]
    handleAddRoles()
  }
}

const handleAddRoles = async () => {
  const { error } = await inviteService.addRoles(
    props.inviteId,
    props.code,
    form.value,
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    navigateTo('/')
  } else {
    if (invite.value?.roleNames) {
      auth.roles = [
        ...new Set([...auth.roles, ...invite.value.roles.split(',')]),
      ] as Role[]
      toast.success(
        t(
          'invite.added_roles',
          { roles: invite.value.roleNames },
          auth.roles.length,
        ),
        {
          life: 10000,
        },
      )
      navigateTo('/profile')
    }
  }
}

onMounted(() => {
  getInvite()
})
</script>

<template>
  <LoadingLabel
    v-if="loadingApi"
    :label="t('invites.adding_roles')"
    size="1.5rem"
  />
</template>

<script lang="ts">
export default {
  name: 'InviteAddRolesForm',
}
</script>
