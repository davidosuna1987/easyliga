<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import {
  ApiRegisterRequest,
  ApiRegisterByInviteRequest,
} from '@/types/api/auth'
import { ApiErrorObject } from '@/types/errors'
import { Invite, mapApiInviteToInvite } from '@/domain/invite'
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
    !!invite.value?.roles.split(',').some(role => role === 'player'),
)

const getInvite = async () => {
  loadingApi.value = true
  if (props.inviteId && props.code) {
    const { data, error } = await inviteService.get(
      props.inviteId,
      props.code,
      {
        with: 'invitedTo',
        set_appends: 'unavailable_shirt_numbers',
      },
    )
    if (error.value) {
      toast.mapError(Object.values(error.value?.data?.errors))
      errors.value = error.value.data?.errors
    } else if (data.value) {
      invite.value = mapApiInviteToInvite(data.value.data.invite)
    }
    loadingApi.value = false
  }
}

const handleRegister = async () => {
  if (
    !!invite.value?.unavailableShirtNumbers &&
    form.value.shirt_number &&
    invite.value.unavailableShirtNumbers.includes(form.value.shirt_number)
  ) {
    toast.error(t('players.shirt_number_taken'))
    return
  }

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
        <p>
          {{ t('invites.invited_by', { name: invite.invitedTo.name }) }}
        </p>
        <p class="mt-3">
          {{ t('invites.invited_by_fill') }}
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

    <template v-if="props.inviteId && props.code">
      <FormLabel
        v-if="showShirtNumberInput"
        for="shirt_number"
        :label="t('shirts.number')"
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

      <!-- <FormLabel
        for="code"
        :label="t('auth.invite_code')"
        :error="errors?.code?.[0]"
        required
      >
        <InputText
          id="code"
          v-model="formInvite.code"
          type="text"
          readonly
          disabled
        />
      </FormLabel> -->
    </template>

    <template #link>
      <div class="flex justify-end">
        <a @click="showUnavailableShirtNumbersDialog = true">
          {{ t('shirts.show_unavailable') }}
        </a>
      </div>
    </template>

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
  </FormAuthBase>
</template>

<script lang="ts">
export default {
  name: 'FormAuthRegister',
}
</script>
