<script setup lang="ts">
import ClubService from '@/services/club'
import { Federation } from '@/domain/federation'
import { User } from '@/domain/user'
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

const props = defineProps({
  club: {
    type: Object as PropType<Club>,
    required: false,
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
const clubLicenses = ref<License[]>([])
const editingResponsible = ref<boolean>(false)

const loadingApi = ref<boolean>(false)

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

  clubLicenses.value = club.licenses ?? []
  selectedFederation.value = club.federation
  selectedResponsible.value = club.responsible
}

const toggleEditingResponsible = () => {
  if (editingResponsible.value === false) {
    setTimeout(() => {
      const input = document.querySelector(
        '.easy-user-search-form-component input',
      ) as HTMLInputElement
      input?.focus()
    }, 100)
  }
  editingResponsible.value = !editingResponsible.value
}

const handleSubmit = () => {
  !!props.club ? handleUpdate() : handleStore()
}

const handleStore = async () => {
  loadingApi.value = true

  // const { data, error } = await clubService.store(form.value)

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

const stopEditingResponsible = () => {
  if (editingResponsible.value) {
    editingResponsible.value = false
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
</script>

<template>
  <form class="easy-club-form-component" @submit.prevent="handleSubmit">
    <EasyGrid
      :breakpoints="{ sm: 2, lg: 3 }"
      :gap="3"
      @mouseover="stopEditingResponsible"
    >
      <FormLabel :label="t('clubs.name')" required>
        <InputText v-model="form.name" />
      </FormLabel>

      <FormLabel :label="t('clubs.short_name')">
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

    <div class="mt-10" @mouseover="stopEditingResponsible">
      <Heading class="mb-3" tag="h6">{{ t('addresses.address') }}</Heading>
      <AddressForm
        :address="mapApiAddressToAddress(form.address)"
        @address:changed="handleAddressChanged"
        @mouseover="editingResponsible = false"
      />
    </div>

    <div class="mt-10" @mouseover="stopEditingResponsible">
      <LicenseList
        :type="LICENSABLE_TYPE_MAPPER.club"
        :licenses="clubLicenses"
        :licensable="club"
        @license:success="emit('refresh', true)"
      />
    </div>

    <div class="mt-10">
      <FormLabel
        :label="
          editingResponsible
            ? t('clubs.search_responsible')
            : t('clubs.responsible')
        "
      >
        <div class="flex sm:grid sm:grid-cols-3 gap-3 h-[42px]">
          <template v-if="selectedResponsible?.profile && !editingResponsible">
            <ProfileItem
              class="flex-1"
              :profile="selectedResponsible.profile"
            />
          </template>

          <template v-else>
            <UserSearchForm
              class="flex-1"
              :whereRole="ROLE_MAPPER.club"
              :showLabel="false"
              :invitedToId="props.club?.id ?? undefined"
              full
              @selected="handleResponsibleSelected"
              @invited="editingResponsible = false"
            />
          </template>

          <Button
            :label="editingResponsible ? t('forms.cancel') : t('forms.edit')"
            class="action w-min"
            @click.prevent="toggleEditingResponsible()"
          />
        </div>
      </FormLabel>
    </div>

    <div class="flex justify-end mt-10" @mouseover="stopEditingResponsible">
      <Button
        :label="club ? t('clubs.update') : t('clubs.create')"
        :loading="loadingApi"
        @click="handleSubmit"
        type="button"
      />
    </div>
  </form>
</template>

<script lang="ts">
export default {
  name: 'ClubForm',
}
</script>
