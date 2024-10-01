<script setup lang="ts">
import FederationService from '@/services/federation'
import { Federation, FederationScope } from '@/domain/federation'
import { User, UserSearchFormInputRef } from '@/domain/user'
import { ApiFederationFormRequest } from '@/types/api/federation'
import { LICENSABLE_TYPE_MAPPER } from '@/domain/licensable'
import { License } from '@/domain/license'
import { ROLE_MAPPER } from '@/domain/role'
import {
  Address,
  mapAddressToApiAddress,
  mapApiAddressToAddress,
} from '@/domain/address'
import { Club } from '@/domain/club'
import { mapApiFederationToFederation } from '@/domain/federation'

const props = defineProps({
  federation: {
    type: Object as PropType<Federation>,
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
  showClubs: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'created', value: Federation): void
  (e: 'updated', value: Federation): void
  (e: 'refresh', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()
const federationService = new FederationService()

const userSearchFormInputRef = ref<UserSearchFormInputRef>()

const form = ref<ApiFederationFormRequest>({
  id: 0,
  federation_id: null,
  responsible_id: null,
  address_id: null,
  name: '',
  short_name: '',
  scope: null,
  email: '',
  phone: '',
  website: '',
  address: mapAddressToApiAddress(),
})

const selectedFederation = ref<Federation>()
const selectedResponsible = ref<User>()
const federationClubs = ref<Club[]>([])
const federationLicenses = ref<License[]>([])
const editingResponsible = ref<boolean>(false)
const loadingApi = ref<boolean>(false)

const userSearchFormInputLabel = computed(() => {
  if (userSearchFormInputRef.value?.userChanged) {
    return t('responsibles.of.new.federation')
  }

  return userSearchFormInputRef.value?.editingUser ||
    (!readonly && !selectedResponsible.value?.profile)
    ? t('responsibles.of.search.federation')
    : t('responsibles.of.federation')
})

const federationClubList = computed((): Club[] => {
  return [
    ...(props.federation?.clubs ?? []),
    ...(props.federation?.federations ?? []).flatMap(f => f.clubs ?? []),
  ]
})

const setFormData = (federation: Federation) => {
  form.value = {
    id: federation.id,
    name: federation.name,
    short_name: federation.shortName ?? '',
    scope: federation.scope ?? null,
    email: federation.email ?? '',
    phone: federation.phone ?? '',
    website: federation.website ?? '',
    federation_id: federation.federationId ?? null,
    responsible_id: federation.responsibleId ?? null,
    address_id: federation.addressId ?? null,
    address: mapAddressToApiAddress(federation.address),
  }

  federationClubs.value = federation.clubs ?? []
  federationLicenses.value = federation.licenses ?? []
  selectedFederation.value = federation.federation
  selectedResponsible.value = federation.responsible
}

const handleSubmit = () => {
  !!props.federation ? handleUpdate() : handleStore()
}

const handleStore = async () => {
  loadingApi.value = true

  // const { data, error } = await s.store(form.value)

  // if (error.value) {
  //   toast.mapError(Object.values(error.value?.data?.errors), false)
  // } else if (data.value) {
  //   toast.success(t('federations.created'))
  //   emit('created', data.value.data.federation)
  // }

  loadingApi.value = false
}

const handleUpdate = async () => {
  loadingApi.value = true

  const { data, error } = await federationService.update(
    form.value.id,
    form.value,
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success(t('federations.updated'))
    emit('updated', mapApiFederationToFederation(data.value.data.federation))
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

const stopEditingResponsible = (cancel = false) => {
  if (cancel && props.federation?.responsible) {
    handleResponsibleSelected(props.federation.responsible)
  }

  if (
    userSearchFormInputRef.value?.editingUser &&
    !userSearchFormInputRef.value?.userChanged
  ) {
    userSearchFormInputRef.value?.stopEditing()
  }
}

const handleScopeSelected = (scope: FederationScope) => {
  form.value.scope = scope
}

watch(
  () => props.federation,
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
  <form class="easy-federation-form-component" @submit.prevent="handleSubmit">
    <EasyGrid
      :breakpoints="{ sm: 2, lg: 3 }"
      :gap="3"
      @mouseenter="stopEditingResponsible()"
    >
      <FormLabel :label="t('federations.name')" required>
        <InputText v-model="form.name" />
      </FormLabel>

      <FormLabel :label="t('forms.short_name')">
        <InputText v-model="form.short_name" />
      </FormLabel>

      <FormLabel :label="t('federations.scope.label')">
        <FederationScopeSelector
          :scope="form.scope ?? undefined"
          @scope:selected="handleScopeSelected"
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

    <div v-if="showResponsible" class="mt-10">
      <UserSearchFormInput
        ref="userSearchFormInputRef"
        :userOriginal="props.federation?.responsible"
        :userSelected="selectedResponsible"
        :invitedToId="props.federation?.id"
        :whereRole="ROLE_MAPPER.federation"
        :label="userSearchFormInputLabel"
        :breakpoints="{ sm: 2, lg: 3 }"
        @selected="handleResponsibleSelected"
        @invited="stopEditingResponsible(true)"
        @cancel="stopEditingResponsible(true)"
      />
    </div>

    <div
      v-if="showLicenses"
      class="mt-10"
      @mouseenter="stopEditingResponsible()"
    >
      <LicenseList
        :type="LICENSABLE_TYPE_MAPPER.federation"
        :licenses="federationLicenses"
        :licensable="federation"
        @license:success="emit('refresh', true)"
      />
    </div>

    <FormFooterActions
      class="mt-10"
      :loading="loadingApi"
      :submitLabel="
        props.federation ? t('federations.update') : t('federations.create')
      "
      hideCancel
      stickyBreakpoint="sm"
      @form:submit="handleSubmit"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'FederationForm',
}
</script>
