<script setup lang="ts">
import ClubService from '@/services/club'
import { Federation } from '@/domain/federation'
import { User, UserSearchFormInputRef } from '@/domain/user'
import { ApiClub, ApiClubFormRequest } from '@/types/api/club'
import { Club } from '@/domain/club'
import { LICENSABLE_TYPE_MAPPER } from '@/domain/licensable'
import { License } from '@/domain/license'
import { ROLE_MAPPER } from '@/domain/role'
import {
  Address,
  mapAddressToApiAddress,
  mapApiAddressToAddress,
} from '@/domain/address'
import { Sede } from '@/domain/sede'

const props = defineProps({
  club: {
    type: Object as PropType<Club>,
    required: false,
  },
  showLicenses: {
    type: Boolean,
    default: true,
  },
  showResponsible: {
    type: Boolean,
    default: true,
  },
  showSedes: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'created', value: ApiClub): void
  (e: 'updated', value: ApiClub): void
  (e: 'refresh', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()
const clubService = new ClubService()

const userSearchFormInputRef = ref<UserSearchFormInputRef>()

const form = ref<ApiClubFormRequest>({
  id: 0,
  federation_id: null,
  responsible_id: null,
  address_id: null,
  name: '',
  short_name: '',
  email: '',
  phone: '',
  website: '',
  address: mapAddressToApiAddress(),
})

const selectedFederation = ref<Federation>()
const selectedResponsible = ref<User>()
const clubSedes = ref<Sede[]>([])
const clubLicenses = ref<License[]>([])
const editingResponsible = ref<boolean>(false)
const loadingApi = ref<boolean>(false)

const userSearchFormInputLabel = computed(() => {
  if (userSearchFormInputRef.value?.userChanged) {
    return t('responsibles.of.new.sede')
  }

  return userSearchFormInputRef.value?.editingUser ||
    (!readonly && !selectedResponsible.value?.profile)
    ? t('responsibles.of.search.sede')
    : t('responsibles.of.sede')
})

const setFormData = (club: Club) => {
  form.value = {
    id: club.id,
    name: club.name,
    short_name: club.shortName ?? '',
    email: club.email ?? '',
    phone: club.phone ?? '',
    website: club.website ?? '',
    federation_id: club.federationId ?? null,
    responsible_id: club.responsibleId ?? null,
    address_id: club.addressId ?? null,
    address: mapAddressToApiAddress(club.address),
  }

  clubSedes.value = club.sedes ?? []
  clubLicenses.value = club.licenses ?? []
  selectedFederation.value = club.federation
  selectedResponsible.value = club.responsible
}

const handleSubmit = () => {
  !!props.club ? handleUpdate() : handleStore()
}

const handleStore = async () => {
  loadingApi.value = true

  // const { data, error } = await s.store(form.value)

  // if (error.value) {
  //   toast.mapError(Object.values(error.value?.data?.errors), false)
  // } else if (data.value) {
  //   toast.success(t('clubs.created'))
  //   emit('created', data.value.data.club)
  // }

  loadingApi.value = false
}

const handleUpdate = async () => {
  loadingApi.value = true

  const { data, error } = await clubService.update(form.value.id, form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success(t('clubs.updated'))
    emit('updated', data.value.data.club)
  }

  loadingApi.value = false
}

const handleResponsibleSelected = (responsible: User) => {
  selectedResponsible.value = responsible
  form.value.responsible_id = responsible.id
}

const handleAddressChanged = (address: Address) => {
  form.value.address = mapAddressToApiAddress(address)
}

const handleFederationSelected = (federation: Federation) => {
  selectedFederation.value = federation
  form.value.federation_id = federation.id
}

const stopEditingResponsible = (cancel = false) => {
  if (cancel && props.club?.responsible) {
    handleResponsibleSelected(props.club.responsible)
  }

  if (
    userSearchFormInputRef.value?.editingUser &&
    !userSearchFormInputRef.value?.userChanged
  ) {
    userSearchFormInputRef.value?.stopEditing()
  }
}

watch(
  () => props.club,
  value => {
    if (value) {
      setFormData(value)
    }
  },
  {
    immediate: true,
  },
)

defineExpose({
  handleSubmit,
  loadingApi,
})
</script>

<template>
  <form class="easy-club-form-component" @submit.prevent="handleSubmit">
    <EasyGrid
      :breakpoints="{ sm: 2, lg: 3 }"
      :gap="3"
      @mouseenter="stopEditingResponsible()"
    >
      <FormLabel :label="t('clubs.name')" required>
        <InputText v-model="form.name" />
      </FormLabel>

      <FormLabel :label="t('forms.short_name')">
        <InputText v-model="form.short_name" />
      </FormLabel>

      <FormLabel :label="t('federations.federation')">
        <FederationSelector
          v-model="selectedFederation"
          @federation:selected="handleFederationSelected"
        />
      </FormLabel>

      <FormLabel :label="t('forms.email')">
        <InputText v-model="form.email" />
      </FormLabel>

      <FormLabel :label="t('forms.phone')">
        <InputText v-model="form.phone" />
      </FormLabel>

      <FormLabel :label="t('forms.website')">
        <InputText v-model="form.website" />
      </FormLabel>
    </EasyGrid>

    <div class="mt-10" @mouseenter="stopEditingResponsible()">
      <Heading class="mb-3" tag="h6">{{ t('addresses.address') }}</Heading>
      <AddressForm
        :address="mapApiAddressToAddress(form.address)"
        @address:changed="handleAddressChanged"
        @mouseenter="editingResponsible = false"
      />
    </div>

    <div v-if="showSedes" class="mt-10">
      <SedeList
        :sedes="clubSedes"
        :clubId="club?.id"
        @refresh="emit('refresh', true)"
      />
    </div>

    <div
      v-if="showLicenses"
      class="mt-10"
      @mouseenter="stopEditingResponsible()"
    >
      <LicenseList
        :type="LICENSABLE_TYPE_MAPPER.club"
        :licenses="clubLicenses"
        :licensable="club"
        @license:success="emit('refresh', true)"
      />
    </div>

    <div v-if="showResponsible" class="mt-10">
      <UserSearchFormInput
        ref="userSearchFormInputRef"
        :userOriginal="props.club?.responsible"
        :userSelected="selectedResponsible"
        :invitedToId="props.club?.id"
        :whereRole="ROLE_MAPPER.club"
        :label="userSearchFormInputLabel"
        :breakpoints="{ sm: 2, lg: 3 }"
        @selected="handleResponsibleSelected"
        @invited="stopEditingResponsible(true)"
        @cancel="stopEditingResponsible(true)"
      />
    </div>

    <FormFooterActions
      class="mt-10"
      :loading="loadingApi"
      :submitLabel="props.club ? t('clubs.update') : t('clubs.create')"
      hideCancel
      @form:submit="handleSubmit"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'ClubForm',
}
</script>
