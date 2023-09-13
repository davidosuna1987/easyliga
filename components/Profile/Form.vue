<script setup lang="ts">
import {
  Image,
  Profile,
  ProfileUpdateRequest,
  mapProfileToProfileUpdateRequest,
  mapProfileUpdateRequestToApiProfileUpdateRequest,
} from '@/domain/profile'
import { ApiErrorObject } from '@/types/errors'
import { Address } from 'domain/address'
import ProfileService from '@/services/profile'

const profileService = new ProfileService()
const toast = useEasyToast()
const { t } = useI18n()

const props = defineProps({
  profile: {
    type: Object as PropType<Profile>,
    required: true,
  },
})

const emit = defineEmits(['updated'])

const address = ref<Address>(
  props.profile.address ?? {
    line1: undefined,
    line2: undefined,
    city: undefined,
    state: undefined,
    country: undefined,
    postalCode: undefined,
  },
)

const form = ref<ProfileUpdateRequest>(
  mapProfileToProfileUpdateRequest(props.profile),
)

const errors = ref<ApiErrorObject | null>(null)
const loadingApi = ref<Boolean>(false)

const avatar = ref<Image>({
  preview: props.profile.avatar ?? null,
  file: null,
  name: null,
  size: null,
})

const resetAvatar = () => {
  avatar.value.preview = props.profile.avatar ?? null
  avatar.value.file = null
  avatar.value.name = null
  avatar.value.size = null
}

const avatarChange = (newAvatar: Image) => {
  if (newAvatar.file) {
    avatar.value = newAvatar
  } else {
    resetAvatar()
  }
}

const genderLabel = (gender: string) => t(`forms.${gender}`)

const handleSubmit = async () => {
  if (!form.value) return

  loadingApi.value = true

  const { data, error } = await profileService.update(
    props.profile.id,
    mapProfileUpdateRequestToApiProfileUpdateRequest(form.value),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    resetAvatar()
    toast.success(t('profiles.updated'))
    emit('updated', data.value.data)
  }
  loadingApi.value = false
}

watch(address, () => (form.value.address = address.value))
watch(avatar, () => (form.value.avatar = avatar.value ?? undefined))
</script>

<template>
  <form class="easy-profile-form-component" @submit.prevent="handleSubmit">
    <UploadImage
      :class="{ 'is-muted': loadingApi }"
      :preview="avatar.preview ?? undefined"
      @image="avatarChange"
    />

    <p class="text-lg mb-3">{{ $t('forms.personal_data') }}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FormLabel
        class="mb-3"
        :label="$t('forms.email')"
        :error="errors?.email?.[0]"
      >
        <InputText v-model="form.email" class="w-full" type="email" />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('forms.name')"
        :error="errors?.firstName?.[0]"
      >
        <InputText v-model="form.firstName" class="w-full" type="text" />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('forms.surnames')"
        :error="errors?.lastName?.[0]"
      >
        <InputText
          v-model="form.lastName"
          class="w-full"
          type="text"
          :disabled="!!loadingApi || !props.profile"
        />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('forms.birth_date')"
        :error="errors?.birthDate?.[0]"
      >
        <Calendar
          v-model="form.birthDate"
          class="w-full"
          :dateFormat="`dd '${$t('forms.of')}' MM '${$t('forms.of')}' yy`"
          :touchUI="true"
        />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('forms.gender')"
        :error="errors?.gender?.[0]"
      >
        <Dropdown
          v-model="form.gender"
          class="w-full"
          :options="['male', 'female', 'other']"
          :optionLabel="genderLabel"
          :disabled="!!loadingApi || !props.profile"
        />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('forms.phone')"
        :error="errors?.phone?.[0]"
      >
        <InputText
          v-model="form.phone"
          class="w-full"
          type="text"
          :disabled="!!loadingApi || !props.profile"
        />
      </FormLabel>
    </div>

    <p class="text-lg mt-6 mb-3">{{ $t('addresses.address') }}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FormLabel
        class="mb-3"
        :label="$t('addresses.line1')"
        :error="errors?.line1?.[0]"
      >
        <InputText v-model="address.line1" class="w-full" type="text" />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('addresses.line2')"
        :error="errors?.line2?.[0]"
      >
        <InputText v-model="address.line2" class="w-full" type="text" />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('addresses.city')"
        :error="errors?.city?.[0]"
      >
        <InputText v-model="address.city" class="w-full" type="text" />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('addresses.state')"
        :error="errors?.state?.[0]"
      >
        <InputText v-model="address.state" class="w-full" type="text" />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('addresses.country')"
        :error="errors?.country?.[0]"
      >
        <InputText v-model="address.country" class="w-full" type="text" />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="$t('addresses.postal_code')"
        :error="errors?.postalCode?.[0]"
      >
        <InputText v-model="address.postalCode" class="w-full" type="text" />
      </FormLabel>
    </div>

    <footer
      class="be-user-form-footer flex justify-content-between align-items-center w-full mt-4"
    >
      <Button
        type="submit"
        class="px-5 ml-auto mr-0"
        :class="{ 'is-loading': loadingApi }"
        :disabled="!!loadingApi || !props.profile"
        >{{ $t('forms.update') }}</Button
      >
    </footer>
  </form>
</template>

<script lang="ts">
export default {
  name: 'ProfileForm',
}
</script>
