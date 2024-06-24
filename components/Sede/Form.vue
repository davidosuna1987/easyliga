<script setup lang="ts">
import {
  Sede,
  SedeRequest,
  mapSedeRequestToApiSedeRequest,
  mapSedeToSedeRequest,
} from '@/domain/sede'
import { ApiErrorObject } from '@/types/errors'
import SedeService from '@/services/sede'
import { User } from '@/domain/user'
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

const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const form = ref<SedeRequest>(mapSedeToSedeRequest(props.sede))
const editingResponsible = ref<boolean>(false)
const selectedResponsible = ref<User | undefined>(
  props.sede?.responsible ?? undefined,
)

const successMessage = computed(() =>
  props.sede ? t('sedes.updated') : t('sedes.created'),
)

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

const toggleEditingResponsible = () => {
  if (!!editingResponsible.value && !!props.sede?.responsible) {
    handleResponsibleSelected(props.sede.responsible)
  }

  editingResponsible.value = !editingResponsible.value
}

const handleAddressChanged = (address: Address) => {
  form.value.address = address
}

const stopEditingResponsible = () => {
  if (editingResponsible.value) {
    editingResponsible.value = false
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
    >
      <InputText v-model="form.name" :readonly="readonly" />
    </FormLabel>

    <EasyGrid class="mt-3" :cols="2" :gap="3">
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

    <div class="mt-10" @mouseover="stopEditingResponsible">
      <Heading class="mb-3" tag="h6">{{ t('addresses.address') }}</Heading>
      <AddressForm
        :address="form.address"
        @address:changed="handleAddressChanged"
        :reduced="reduced"
        :readonly="readonly"
      />
    </div>

    <div class="mt-10">
      <FormLabel
        :label="
          editingResponsible || (!readonly && !selectedResponsible?.profile)
            ? t('responsibles.of.search.sede')
            : t('responsibles.of.sede')
        "
      />
      <div
        :class="[
          'flex gap-3 h-[42px]',
          reduced ? '' : 'sm:grid sm:grid-cols-3',
        ]"
      >
        <template
          v-if="
            !!readonly || (selectedResponsible?.profile && !editingResponsible)
          "
        >
          <ProfileItem
            v-if="selectedResponsible?.profile"
            class="flex-1"
            :profile="selectedResponsible.profile"
          />
          <p v-else>{{ t('responsibles.of.not_found') }}</p>
        </template>
        <template v-else>
          <UserSearchForm
            class="flex-1"
            :whereRole="ROLE_MAPPER.club"
            :showLabel="false"
            :invitedToId="props.sede?.clubId ?? undefined"
            full
            @selected="handleResponsibleSelected"
            @invited="editingResponsible = false"
          />
        </template>

        <Button
          v-if="!readonly && selectedResponsible?.profile"
          :label="editingResponsible ? t('forms.cancel') : t('forms.edit')"
          class="action w-min"
          @click.prevent="toggleEditingResponsible()"
        />
      </div>
    </div>

    <FormFooterActions
      v-if="!reduced"
      class="mt-10"
      :loading="loadingApi"
      :submitLabel="props.sede ? t('sedes.update') : t('sedes.create')"
      hideCancel
      @form:submit="handleSubmit"
      @form:cancel="emit('cancel', true)"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'SedeForm',
}
</script>
