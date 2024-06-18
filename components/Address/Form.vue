<script setup lang="ts">
import { Address } from '@/domain/address'
import { ApiErrorObject } from '@/types/errors'
import {
  Country,
  getCountryByCode,
  getCountryNameByLocale,
} from '@/domain/country'

const props = defineProps({
  address: {
    type: Object as PropType<Address>,
    required: false,
  },
  errors: {
    type: Object as PropType<ApiErrorObject>,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'address:changed', value: Address): void
}>()

const { t, locale } = useI18n()

const form = ref<Address>(
  props.address ?? {
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

const selectedCountry = ref<Country>()
const apiErrors = ref<ApiErrorObject | null>(null)

const mappedErrors = computed((): ApiErrorObject => {
  const errors: ApiErrorObject = {}
  const errorsMap = props.errors ? props.errors : apiErrors.value

  if (errorsMap) {
    for (const key in errorsMap) {
      errors[key] = errorsMap[key].map((error: string) => error)
    }
  }

  return errors
})

const handleCountrySelected = (country: Country | undefined) => {
  selectedCountry.value = country
  form.value.countryCode = country ? country.alpha2Code : undefined
  form.value.country = country
    ? getCountryNameByLocale(country, locale.value)
    : undefined
}

const setSelectedCountry = () => {
  if (!form.value.countryCode) return
  selectedCountry.value = getCountryByCode(form.value.countryCode)
}

watch(
  () => form.value,
  value => {
    emit('address:changed', value)
  },
  { deep: true, immediate: true, flush: 'sync' },
)

onMounted(() => {
  setSelectedCountry()
})
</script>

<template>
  <form class="easy-address-form-component">
    <EasyGrid :breakpoints="{ md: 2 }" :gap="3">
      <FormLabel
        class="mb-3"
        :label="t('addresses.line1')"
        :error="mappedErrors?.line1?.[0]"
      >
        <InputText
          v-model="form.line1"
          class="w-full"
          type="text"
          :disabled="disabled"
        />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="t('addresses.line2')"
        :error="mappedErrors?.line2?.[0]"
      >
        <InputText
          v-model="form.line2"
          class="w-full"
          type="text"
          :disabled="disabled"
        />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="t('addresses.city')"
        :error="mappedErrors?.city?.[0]"
      >
        <InputText
          v-model="form.city"
          class="w-full"
          type="text"
          :disabled="disabled"
        />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="t('addresses.state')"
        :error="mappedErrors?.state?.[0]"
      >
        <InputText
          v-model="form.state"
          class="w-full"
          type="text"
          :disabled="disabled"
        />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="t('addresses.country')"
        :error="mappedErrors?.country?.[0]"
      >
        <CountrySelector
          v-model="selectedCountry"
          @selected="handleCountrySelected"
        />
      </FormLabel>
      <FormLabel
        class="mb-3"
        :label="t('addresses.postal_code')"
        :error="mappedErrors?.postalCode?.[0]"
      >
        <InputText
          v-model="form.postalCode"
          class="w-full"
          type="text"
          :disabled="disabled"
        />
      </FormLabel>
    </EasyGrid>
  </form>
</template>

<script lang="ts">
export default {
  name: 'AddressForm',
}
</script>