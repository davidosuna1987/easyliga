<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiAddRolesRequest } from '@/types/api/invite'
import { Invite, mapApiInviteToInvite, invitedAsPlayer } from '@/domain/invite'
import { Role } from '@/domain/role'
import InviteService from '@/services/invite'
import { ApiErrorObject } from '@/types/errors'

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
const showShirtNumberInput = ref<boolean>(false)
const showUnavailableShirtNumbersDialog = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const loadingApi = ref<boolean>(false)

const loadingLabel = computed(() =>
  invite.value ? t('invites.adding_roles') : t('invites.loading'),
)

const isInvitedAsPlayer = computed(() =>
  invite.value ? invitedAsPlayer(invite.value) : false,
)

const getInvite = async () => {
  loadingApi.value = true

  const { data, error } = await inviteService.get(props.inviteId, props.code, {
    with: 'invitedTo',
    set_appends: 'role_names,unavailable_shirt_numbers',
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
  loadingApi.value = true

  const { error } = await inviteService.addRoles(
    props.inviteId,
    props.code,
    form.value,
  )

  if (error.value) {
    toast.mapError(
      Object.values(error.value?.data?.errors),
      isInvitedAsPlayer.value,
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

    <div class="mt-6" v-if="showShirtNumberInput && invite?.invitedTo">
      <p class="mb-3">
        {{
          t('invites.select_team_shirt_number', {
            teamName: invite?.invitedTo.name,
          })
        }}
      </p>
      <p class="mb-10">{{ t('invites.show_unavailable_shirt_numbers') }}</p>

      <FormLabel
        for="shirt_number"
        :label="t('shirts.number_select')"
        :error="errors?.shirt_number?.[0]"
        required
      >
        <InputNumber
          id="shirt_number"
          v-model="form.shirt_number"
          showButtons
          buttonLayout="horizontal"
          :min="1"
          :max="999"
        />
      </FormLabel>

      <div class="flex justify-end mt-3">
        <a
          class="cursor-pointer"
          @click="showUnavailableShirtNumbersDialog = true"
        >
          {{ t('shirts.show_unavailable') }}
        </a>
      </div>
    </div>

    <FormFooterActions
      class="mt-6"
      :submitLabel="t('invites.accept')"
      hideCancel
      :disabled="loadingApi"
      :loading="loadingApi"
      @form:submit="handleAddRoles"
    />

    <DialogBottom
      v-if="invite?.unavailableShirtNumbers"
      class="easy-unavailable-shirt-numbers-dialog-component"
      :visible="showUnavailableShirtNumbersDialog"
      @hide="showUnavailableShirtNumbersDialog = false"
    >
      <template #header>
        <Heading tag="h6">{{ t('shirts.unavailable') }}</Heading>
      </template>

      <div class="flex gap-3 justify-center flex-wrap mt-5">
        <IconShirtNumber
          v-for="shirtNumber in invite.unavailableShirtNumbers"
          :shirtNumber="shirtNumber"
          size="lg"
          isIcon
        />
      </div>
    </DialogBottom>
  </form>
</template>

<script lang="ts">
export default {
  name: 'InviteAddRolesForm',
}
</script>
