<script setup lang="ts">
import {
  Sede,
  SedeRequest,
  mapSedeRequestToApiSedeRequest,
  mapSedeToSedeRequest,
} from '@/domain/sede'
import { ApiErrorObject } from '@/types/errors'
import SedeService from '@/services/sede'
import { User, UserSearchFormInputRef } from '@/domain/user'
import { ROLE_MAPPER } from '@/domain/role'
import { Address } from '@/domain/address'

const props = defineProps({
  sede: {
    type: Object as PropType<Sede>,
    required: false,
  },
  clubId: {
    type: Number,
    required: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  reduced: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'cancel', value: boolean): void
  (e: 'success', value: string): void
  (e: 'loading', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()
const sedeService = new SedeService()

const userSearchFormInputRef = ref<UserSearchFormInputRef>()

const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const form = ref<SedeRequest>(mapSedeToSedeRequest(props.sede))
const selectedResponsible = ref<User | undefined>(
  props.sede?.responsible ?? undefined,
)

const successMessage = computed(() =>
  props.sede ? t('sedes.updated') : t('sedes.created'),
)

const userSearchFormInputLabel = computed(() => {
  if (userSearchFormInputRef.value?.userChanged) {
    return t('responsibles.of.new.sede')
  }

  return userSearchFormInputRef.value?.editingUser ||
    (!readonly && !selectedResponsible.value?.profile)
    ? t('responsibles.of.search.sede')
    : t('responsibles.of.sede')
})

const handleSubmit = () => {
  if (props.sede) handleUpdate()
  else handleStore()
}

const handleStore = async () => {
  loadingApi.value = true
  form.value.clubId = props.clubId
  const { data, error } = await sedeService.store(
    mapSedeRequestToApiSedeRequest(form.value),
  )
  handleResponse(data, error, 'created')
}

const handleUpdate = async () => {
  loadingApi.value = true
  const { data, error } = await sedeService.update(
    form.value.id,
    mapSedeRequestToApiSedeRequest(form.value),
  )
  handleResponse(data, error, 'updated')
}

const handleResponse = (data: any, error: any, action: string) => {
  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value.data?.errors
  } else if (data.value) {
    toast.success(successMessage.value)
    emit('success', action)
  }

  loadingApi.value = false
}

const handleResponsibleSelected = (responsible: User) => {
  selectedResponsible.value = responsible
  form.value.responsibleId = responsible.id
}

const handleAddressChanged = (address: Address) => {
  form.value.address = address
}

const stopEditingResponsible = (cancel = false) => {
  if (cancel && props.sede?.responsible) {
    handleResponsibleSelected(props.sede.responsible)
  }

  if (
    userSearchFormInputRef.value?.editingUser &&
    !userSearchFormInputRef.value?.userChanged
  ) {
    userSearchFormInputRef.value?.stopEditing()
  }
}

watch(
  () => loadingApi.value,
  value => {
    emit('loading', value)
  },
)

defineExpose({
  handleSubmit,
  loadingApi,
})
</script>

<template>
  <form class="easy-sede-form-component" @submit.prevent="handleSubmit">
    <FormLabel
      :label="t('sedes.name')"
      :error="errors?.name?.[0]"
      :required="!readonly"
      @mouseenter="stopEditingResponsible()"
    >
      <InputText v-model="form.name" :readonly="readonly" />
    </FormLabel>

    <EasyGrid
      class="mt-3"
      :cols="2"
      :gap="3"
      @mouseenter="stopEditingResponsible()"
    >
      <FormLabel :label="t('forms.short_name')" :error="errors?.shortName?.[0]">
        <InputText v-model="form.shortName" :readonly="readonly" />
      </FormLabel>

      <FormLabel
        :label="t('forms.email')"
        :error="errors?.email?.[0]"
        :required="!readonly"
      >
        <InputText v-model="form.email" :readonly="readonly" />
      </FormLabel>

      <FormLabel :label="t('forms.phone')" :error="errors?.phone?.[0]">
        <InputText v-model="form.phone" :readonly="readonly" />
      </FormLabel>

      <FormLabel :label="t('forms.website')" :error="errors?.website?.[0]">
        <InputText v-model="form.website" :readonly="readonly" />
      </FormLabel>
    </EasyGrid>

    <div class="mt-10" @mouseenter="stopEditingResponsible()">
      <Heading class="mb-3" tag="h6">{{ t('addresses.address') }}</Heading>
      <AddressForm
        :address="form.address"
        @address:changed="handleAddressChanged"
        :reduced="reduced"
        :readonly="readonly"
      />
    </div>

    <div class="mt-10">
      <UserSearchFormInput
        ref="userSearchFormInputRef"
        :userOriginal="props.sede?.responsible"
        :userSelected="selectedResponsible"
        :invitedToId="props.sede?.clubId"
        :whereRole="ROLE_MAPPER.club"
        :label="userSearchFormInputLabel"
        :readonly="readonly"
        :reduced="reduced"
        @selected="handleResponsibleSelected"
        @invited="stopEditingResponsible(true)"
        @cancel="stopEditingResponsible(true)"
      />
    </div>

    <FormFooterActions
      v-if="!reduced"
      class="mt-10"
      :loading="loadingApi"
      :submitLabel="props.sede ? t('sedes.update') : t('sedes.create')"
      hideCancel
      @form:submit="handleSubmit"
      @form:cancel="emit('cancel', true)"
      @mouseenter="stopEditingResponsible()"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'SedeForm',
}
</script>
