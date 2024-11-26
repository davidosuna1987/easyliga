<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiAddRolesRequest } from '@/types/api/invite'
import {
  Invite,
  mapApiInviteToInvite,
  invitedAsPlayer,
  invitedAsRole,
} from '@/domain/invite'
import { Role, ROLE_MAPPER } from '@/domain/role'
import InviteService from '@/services/invite'
import { ApiErrorObject } from '@/types/errors'
import { InviteShirtNumberInputRef } from '@/domain/invite'

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
  shirt_number: null,
})

const invite = ref<Invite>()
const shirtNumberInputRef = ref<InviteShirtNumberInputRef>()
const showShirtNumberInput = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const loadingApi = ref<boolean>(false)

const loadingLabel = computed(() =>
  invite.value ? t('invites.adding_roles') : t('invites.loading'),
)

const isInvitedAsPlayer = computed(() =>
  invite.value ? invitedAsPlayer(invite.value) : false,
)

const isInvitedAsRefereeAdmin = computed(() =>
  invite.value ? invitedAsRole(invite.value, ROLE_MAPPER.referee_admin) : false,
)

const getInvite = async () => {
  loadingApi.value = true

  const { data, error } = await inviteService.get(props.inviteId, props.code, {
    with: 'invitedTo',
    set_appends: 'role_names,email_role_names,unavailable_shirt_numbers',
  })
  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    navigateTo('/')
  } else if (data.value) {
    invite.value = mapApiInviteToInvite(data.value.data.invite)
    form.value.roles = invite.value.roles

    if (isInvitedAsPlayer.value) {
      showShirtNumberInput.value = true
      loadingApi.value = false
    } else {
      handleAddRoles()
    }
  }
}

const handleAddRoles = async () => {
  if (!form.value.shirt_number && isInvitedAsPlayer.value) {
    toast.error(t('errors.correct_before_proceed'))
    errors.value = { shirt_number: [t('shirts.required')] }
    return
  }

  if (shirtNumberInputRef.value?.isShirtNumberTaken()) {
    errors.value = { shirt_number: [t('shirts.required')] }
    return
  }

  errors.value = null

  loadingApi.value = true

  const { error } = await inviteService.addRoles(
    props.inviteId,
    props.code,
    form.value,
  )

  if (error.value) {
    toast.mapError(
      Object.values(error.value?.data?.errors),
      !isInvitedAsPlayer.value && !isInvitedAsRefereeAdmin.value,
    )

    if (isInvitedAsPlayer.value) {
      errors.value = error.value.data.errors
      loadingApi.value = false
    } else {
      navigateTo('/')
    }
  } else {
    if (invite.value?.roleNames) {
      auth.roles = [
        ...new Set([...auth.roles, ...invite.value.roles]),
      ] as Role[]
      toast.success(
        t(
          'invites.added_roles',
          { roles: invite.value.roleNames },
          invite.value.roles.length,
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
  <form @submit.prevent="handleAddRoles">
    <EasyGrid justify="center">
      <LoadingLabel v-if="loadingApi" :label="loadingLabel" size="1.8rem" />
      <Heading v-else tag="h5">{{ t('invites.add_roles') }}</Heading>
    </EasyGrid>

    <div class="mt-6" v-if="showShirtNumberInput && invite">
      <InviteShirtNumberInput
        ref="shirtNumberInputRef"
        :invite="invite"
        :error="errors?.shirt_number?.[0]"
        showDisclaimer
        @shirtNumber:changed="form.shirt_number = $event"
      />

      <FormFooterActions
        class="mt-6"
        :submitLabel="t('invites.accept')"
        :disabled="loadingApi"
        :loading="loadingApi"
        @form:submit="handleAddRoles"
        @form:cancel="navigateTo('/')"
      />
    </div>
  </form>
</template>

<script lang="ts">
export default {
  name: 'InviteAddRolesForm',
}
</script>
