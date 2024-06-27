<script setup lang="ts">
import { Address, mapAddress } from '@/domain/address'
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
  reduced: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'address:changed', value: Address): void
}>()

const { t, locale } = useI18n()

const form = ref<Address>(mapAddress(props.address))

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
    <EasyGrid
      :breakpoints="{ sm: reduced ? 1 : 2, md: 2, lg: reduced ? 2 : 3 }"
      :gap="3"
    >
      <FormLabel
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
      <FormLabel :label="t('addresses.city')" :error="mappedErrors?.city?.[0]">
        <InputText
          v-model="form.city"
          class="w-full"
          type="text"
          :disabled="disabled"
        />
      </FormLabel>
      <FormLabel
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
        :label="t('addresses.country')"
        :error="mappedErrors?.country?.[0]"
      >
        <CountrySelector
          v-model="selectedCountry"
          @country:selected="handleCountrySelected"
        />
      </FormLabel>
      <FormLabel
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
