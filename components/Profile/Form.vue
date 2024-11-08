<script setup lang="ts">
import {
  Image,
  NIF_TYPES,
  NifType,
  Profile,
  ProfileUpdateRequest,
  mapProfileToProfileUpdateRequest,
  mapProfileUpdateRequestToApiProfileUpdateRequest,
} from '@/domain/profile'
import { UpdateClubTeamPlayer } from '@/domain/player'
import { ApiErrorObject } from '@/types/errors'
import { Address } from '@/domain/address'
import ClubService from '@/services/club'
import ProfileService from '@/services/profile'
import { PROFILE_GENDER_TYPES } from '@/domain/profile'
import { getInitials } from '@/domain/utils'
import { ApiProfile } from '@/types/api/profile'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps({
  profile: {
    type: Object as PropType<Profile>,
    required: true,
  },
  hideAvatar: {
    type: Boolean,
    default: false,
  },
  hidePlayerId: {
    type: Boolean,
    default: false,
  },
  hideRoles: {
    type: Boolean,
    default: false,
  },
  clubTeamPlayer: {
    type: Object as PropType<UpdateClubTeamPlayer>,
    required: false,
  },
  isStickyAction: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'updated', value: ApiProfile): void
}>()

const { t } = useI18n()
const auth = useAuthStore()
const toast = useEasyToast()
const clubService = new ClubService()
const profileService = new ProfileService()

const address = ref<Address>(
  props.profile.address ?? {
    id: 0,
    line1: undefined,
    line2: undefined,
    city: undefined,
    state: undefined,
    country: undefined,
    countryCode: undefined,
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

const nifTypeLabel = (nifType: NifType) => t(`forms.${nifType}`)

const handleSubmit = async () => {
  if (!form.value) return

  loadingApi.value = true

  if (props.clubTeamPlayer) {
    const { data, error } = await clubService.updateTeamPlayerProfile(
      props.clubTeamPlayer.clubId,
      props.clubTeamPlayer.teamId,
      props.profile.id,
      mapProfileUpdateRequestToApiProfileUpdateRequest(form.value),
      {
        with: 'address',
      },
    )

    if (error.value) {
      toast.mapError(Object.values(error.value?.data?.errors), false)
    } else if (data.value) {
      resetAvatar()
      toast.success(t('profiles.updated'))
      emit('updated', data.value.data.profile)
    }
  } else {
    const { data, error } = await profileService.update(
      props.profile.id,
      mapProfileUpdateRequestToApiProfileUpdateRequest(form.value),
    )

    if (error.value) {
      toast.mapError(Object.values(error.value?.data?.errors), false)
    } else if (data.value) {
      resetAvatar()
      toast.success(t('profiles.updated'))
      emit('updated', data.value.data.profile)
    }
  }

  loadingApi.value = false
}

watch(
  () => address.value,
  value => {
    form.value.address = value
  },
)

watch(
  () => avatar.value,
  value => {
    form.value.avatar = value ?? undefined
  },
)
</script>

<template>
  <form class="easy-profile-form-component" @submit.prevent="handleSubmit">
    <UploadImage
      v-if="!props.hideAvatar"
      :class="{ 'is-muted': loadingApi }"
      :preview="avatar.preview ?? ''"
      :initials="getInitials([props.profile.firstName, props.profile.lastName])"
      @image="avatarChange"
    />

    <Heading v-if="!hidePlayerId" tag="h5" position="center" class="player-id">
      {{ `${t('profiles.player_id')}: ${profile.playerId}` }}
    </Heading>

    <template v-if="!hideRoles">
      <p class="text-lg mb-3">{{ t('roles.role', 2) }}</p>
      <div class="flex flex-wrap gap-1">
        <Tag
          v-for="role in auth.roles"
          :key="role"
          :value="t(`roles.type.${role}`)"
        />
      </div>
    </template>

    <p class="text-lg mb-3 mt-6">{{ t('forms.personal_data') }}</p>
    <EasyGrid :breakpoints="{ md: 2 }" :gap="3">
      <FormLabel :label="t('forms.email')" :error="errors?.email?.[0]">
        <InputText v-model="form.email" class="w-full" type="email" />
      </FormLabel>
      <FormLabel :label="t('forms.name')" :error="errors?.firstName?.[0]">
        <InputText v-model="form.firstName" class="w-full" type="text" />
      </FormLabel>
      <FormLabel :label="t('forms.surnames')" :error="errors?.lastName?.[0]">
        <InputText
          v-model="form.lastName"
          class="w-full"
          type="text"
          :disabled="!!loadingApi || !props.profile"
        />
      </FormLabel>
      <FormLabel :label="t('forms.birth_date')" :error="errors?.birthDate?.[0]">
        <Calendar v-model="form.birthDate" class="w-full" :touchUI="true" />
      </FormLabel>
      <FormLabel :label="t('forms.gender')" :error="errors?.gender?.[0]">
        <Dropdown
          v-model="form.gender"
          class="w-full"
          :options="[
            PROFILE_GENDER_TYPES.male,
            PROFILE_GENDER_TYPES.female,
            PROFILE_GENDER_TYPES.other,
          ]"
          :optionLabel="genderLabel"
          :disabled="!!loadingApi || !props.profile"
        />
      </FormLabel>
      <FormLabel :label="t('forms.phone')" :error="errors?.phone?.[0]">
        <InputText
          v-model="form.phone"
          class="w-full"
          type="text"
          :disabled="!!loadingApi || !props.profile"
        />
      </FormLabel>
      <FormLabel :label="t('forms.nif_type')" :error="errors?.nif_type?.[0]">
        <Dropdown
          v-model="form.nifType"
          class="w-full"
          :options="[
            NIF_TYPES.dni,
            NIF_TYPES.nif,
            NIF_TYPES.nie,
            NIF_TYPES.passport,
            NIF_TYPES.cif,
          ]"
          :optionLabel="nifTypeLabel"
          :disabled="!!loadingApi || !props.profile"
        />
      </FormLabel>
      <FormLabel
        :label="
          form.nifType ? nifTypeLabel(form.nifType) : t('forms.select_nif_type')
        "
        :error="errors?.nif?.[0]"
        :style="{ opacity: form.nifType ? 1 : 0.5 }"
      >
        <InputText
          v-model="form.nif"
          class="w-full"
          type="text"
          :disabled="!!loadingApi || !props.profile || !form.nifType"
        />
      </FormLabel>
    </EasyGrid>

    <p class="text-lg mt-6 mb-3">{{ t('addresses.address') }}</p>
    <AddressForm
      :address="address"
      :disabled="!!loadingApi || !props.profile"
      @address:changed="address = $event"
      reduced
    />

    <FormFooterActions
      :disabled="!!loadingApi || !props.profile"
      :loading="!!loadingApi || !props.profile"
      hideCancel
      isStickyAction
      fullWidthContainer
      :submitLabel="t('forms.update')"
      @form:submit="handleSubmit"
    />
  </form>
</template>

<style scoped lang="scss">
.easy-profile-form-component {
  .easy-form-footer-actions-component {
    width: calc(100% + var(--easy-main-padding-tablet) * 2);
  }
}

.easy-dialog-bottom-component {
  .easy-profile-form-component {
    .easy-form-footer-actions-component {
      width: calc(100% + 1.75rem * 2);
      margin-inline: calc(-1.75rem);
      padding-inline: calc(1.75rem);
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'ProfileForm',
}
</script>
