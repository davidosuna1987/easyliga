<script setup lang="ts">
import {
  License,
  LicenseStoreRequest,
  mapLicenseStoreRequestToLicenseUpdateRequest,
  mapLicenseToLicenseStoreRequest,
} from '@/domain/license'
import { formatDate } from '@/domain/utils'
import { ApiErrorObject } from '@/types/errors'
import { LicensableModel, LicensableType } from '@/domain/licensable'
import { Country, getCountryByCode } from '@/domain/country'
import LicenseService from '@/services/license'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps({
  license: {
    type: Object as PropType<License>,
    required: false,
  },
  type: {
    type: String as PropType<LicensableType | 'all'>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'success', value: boolean): void
}>()

const auth = useAuthStore()
const licenseService = new LicenseService()
const toast = useEasyToast()
const {
  $i18n: { t: $t },
} = useNuxtApp()

const selectedCountry = ref<Country>()
const selectedExpiryDate = ref<Date | undefined>(
  props.license ? new Date(props.license.expiryDate) : undefined,
)
const selectedModel = ref<LicensableModel>()
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const form = ref<LicenseStoreRequest>(
  props.license
    ? mapLicenseToLicenseStoreRequest({
        license: props.license,
        type: undefined,
      })
    : mapLicenseToLicenseStoreRequest({
        license: props.license,
        type:
          props.license || props.type === 'all'
            ? 'player'
            : props.type ?? 'player',
      }),
)

const successMessage = computed(() =>
  props.license ? $t('licenses.updated') : $t('licenses.created'),
)

const handleSubmit = () => {
  if (props.license) handleUpdate()
  else handleStore()
}

const handleStore = async () => {
  loadingApi.value = true
  const { data, error } = await licenseService.store(form.value)
  handleResponse(data, error)
}

const handleUpdate = async () => {
  loadingApi.value = true
  const { data, error } = await licenseService.update(
    form.value.id,
    mapLicenseStoreRequestToLicenseUpdateRequest(form.value),
  )
  handleResponse(data, error)
}

const handleResponse = (data: any, error: any) => {
  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value.data?.errors
  } else if (data.value) {
    auth.fresh()
    toast.success(successMessage.value)
    emit('success', true)
  }

  loadingApi.value = false
}

const handleTypeSelected = (type: LicensableType) => {
  form.value.type = type
}

const handleCountrySelected = (country: Country) => {
  selectedCountry.value = country
  form.value.countryCode = country.alpha2Code
}

const handleExpiryDateSelected = (date: string) => {
  selectedExpiryDate.value = new Date(date)
  form.value.expiryDate = formatDate(date, '-', true)
}

const setSelectedCountry = () => {
  if (!form.value.countryCode) return
  selectedCountry.value = getCountryByCode(form.value.countryCode)
}

const handleModelSelected = (model: LicensableModel) => {
  selectedModel.value = model
  form.value.licensableId = model.id
}

const handleFileChanged = (file: File | undefined) => {
  form.value.file = file
}

onMounted(() => {
  setSelectedCountry()
})

defineExpose({
  handleSubmit,
})
</script>

<template>
  <form
    class="easy-license-form-component grid gap-6"
    @submit.prevent="handleSubmit"
  >
    <FormLabel
      :label="$t('licenses.assign_name')"
      :error="errors?.name?.[0]"
      required
    >
      <InputText v-model="form.name" />
    </FormLabel>

    <EasyGrid :cols="!!license || !!type ? 1 : 2" :gap="4">
      <FormLabel
        v-if="!license && !type"
        :label="$t('licenses.type_label')"
        :error="errors?.type?.[0]"
        required
      >
        <LicenseTypeSelector
          v-model="form.type"
          :type="type ? (type === 'all' ? 'player' : type) : form.type"
          @type:selected="handleTypeSelected"
        />
      </FormLabel>

      <FormLabel
        :label="$t('licenses.country')"
        :error="errors?.country_code?.[0]"
        required
      >
        <CountrySelector
          v-model="selectedCountry"
          @selected="handleCountrySelected"
        />
      </FormLabel>
    </EasyGrid>

    <FormLabel
      :label="$t(`licenses.model.select.${type}`)"
      :error="errors?.licensable_id?.[0]"
    >
      <LicenseModelSelector
        v-model="selectedModel"
        :type="type ? type : form.type"
        @model:selected="handleModelSelected"
      />
    </FormLabel>

    <EasyGrid :cols="2" :gap="4">
      <FormLabel
        :label="$t('licenses.number')"
        :error="errors?.license_number?.[0]"
        required
      >
        <InputText v-model="form.licenseNumber" />
      </FormLabel>

      <FormLabel
        :label="$t('forms.expiry_date')"
        :error="errors?.expiry_date?.[0]"
        required
      >
        <Calendar
          v-model="selectedExpiryDate"
          class="w-full"
          :minDate="new Date()"
          :dateFormat="`dd '${$t('forms.of')}' MM '${$t('forms.of')}' yy`"
          :touchUI="true"
          @update:modelValue="handleExpiryDateSelected($event as string)"
        />
      </FormLabel>
    </EasyGrid>

    <FormLabel
      :label="$t('observations.observation', 2)"
      :error="errors?.observations?.[0]"
    >
      <Textarea v-model="form.observations" :rows="5" autoResize />
    </FormLabel>

    <FormLabel :label="$t('forms.file')" :error="errors?.file?.[0]">
      <UploadFile
        :fileName="form.originalFilename"
        @file:changed="handleFileChanged"
      />
    </FormLabel>
  </form>
</template>

<script lang="ts">
export default {
  name: 'LicenseForm',
}
</script>
