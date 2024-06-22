<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import {
  ApiRegisterRequest,
  ApiRegisterByInviteRequest,
} from '@/types/api/auth'
import { ApiErrorObject } from '@/types/errors'
import {
  Invite,
  InviteShirtNumberInputRef,
  invitedAsPlayer,
  mapApiInviteToInvite,
} from '@/domain/invite'
import InviteService from '@/services/invite'

const props = defineProps({
  inviteId: {
    type: Number,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
})

const { t } = useI18n()
const auth = useAuthStore()
const toast = useEasyToast()
const inviteService = new InviteService()

const form = ref<ApiRegisterRequest>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirm: '',
  shirt_number: undefined,
})

const shirtNumberInputRef = ref<InviteShirtNumberInputRef>()
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const invite = ref<Invite | null>(null)
const showUnavailableShirtNumbersDialog = ref<boolean>(false)

const formInvite = computed(
  (): ApiRegisterByInviteRequest => ({
    ...form.value,
    code: props.code ?? '',
  }),
)

const showShirtNumberInput = computed(
  (): boolean =>
    !!props.inviteId &&
    !!props.code &&
    !!invite.value &&
    invitedAsPlayer(invite.value),
)

const getInvite = async () => {
  if (!props.inviteId || !props.code) return

  loadingApi.value = true

  const { data, error } = await inviteService.get(props.inviteId, props.code, {
    with: 'invitedTo',
    set_appends: 'unavailable_shirt_numbers,email_role_names',
  })
  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    navigateTo('/')
  } else if (data.value) {
    invite.value = mapApiInviteToInvite(data.value.data.invite)
  }
  loadingApi.value = false
}

const handleRegister = async () => {
  if (shirtNumberInputRef.value?.isShirtNumberTaken()) return

  loadingApi.value = true
  const { data, error } =
    props.inviteId && props.code
      ? await auth.registerByInvite(props.inviteId, formInvite.value)
      : await auth.register(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value.data?.errors
    loadingApi.value = false
  } else {
    if (data.value) toast.success(data.value.data.message)
    navigateTo('/login')
  }
}

onMounted(() => {
  getInvite()
})
</script>

<template>
  <FormAuthBase
    class="easy-form-auth-register"
    :buttonLabel="t('auth.register')"
    :loading="loadingApi"
    @submit="handleRegister"
  >
    <template v-if="invite?.invitedTo">
      <Message
        severity="primary"
        class="mb-5 relative bottom-3"
        :closable="false"
        :pt="{
          icon: {
            style: {
              display: 'none',
            },
          },
        }"
      >
        <p
          v-html="
            t('invites.invited_by', {
              teamName: invite.invitedTo.name,
              roles: invite.emailRoleNames,
            })
          "
        ></p>
        <p class="mt-3">
          {{ t(`invites.invited_by_fill_${invite.roles[0]}`) }}
        </p>
      </Message>
    </template>

    <FormLabel
      for="first_name"
      :label="t('forms.name')"
      :error="errors?.first_name?.[0]"
      required
    >
      <InputText id="first_name" v-model="form.first_name" type="text" />
    </FormLabel>

    <FormLabel
      for="last_name"
      :label="t('forms.surnames')"
      :error="errors?.last_name?.[0]"
      required
    >
      <InputText id="last_name" v-model="form.last_name" type="text" />
    </FormLabel>

    <FormLabel
      for="email"
      :label="t('forms.email')"
      :error="errors?.email?.[0]"
      required
    >
      <InputText id="email" v-model="form.email" type="email" />
    </FormLabel>

    <FormLabel
      for="password"
      :label="t('forms.password')"
      :error="errors?.password?.[0]"
      required
    >
      <Password input-id="password" v-model="form.password" toggleMask />
    </FormLabel>

    <FormLabel
      for="password_confirm"
      :label="t('forms.password_confirm')"
      :error="errors?.password_confirm?.[0]"
      required
    >
      <Password
        input-id="password_confirm"
        v-model="form.password_confirm"
        toggle-mask
        :feedback="false"
      />
    </FormLabel>

    <InviteShirtNumberInput
      v-if="showShirtNumberInput && invite"
      ref="shirtNumberInputRef"
      :invite="invite"
      :error="errors?.shirt_number?.[0]"
      @shirtNumber:changed="form.shirt_number = $event"
    />
  </FormAuthBase>
</template>

<script lang="ts">
export default {
  name: 'FormAuthRegister',
}
</script>
