<script setup lang="ts">
import { useCountryStore } from '@/stores/useCountryStore'
import { Country } from '@/domain/country'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'country:selected', value: Country): void
}>()

const { t, locale } = useI18n()
const countryStore = useCountryStore()

const countries = ref<Country[]>(props.readonly ? [] : countryStore.countries)
const selectedCountry = ref<Country>()
</script>

<template>
  <Dropdown
    v-model="selectedCountry"
    :class="['easy-countries-selector-component']"
    :panelClass="!!readonly ? 'hidden pointer-events-none' : ''"
    :options="countries"
    :optionLabel="`translations.${locale}`"
    :filter="true"
    :filterLocale="locale"
    :filterPlaceholder="t('countries.search')"
    :emptyFilterMessage="t('forms.no_results_found')"
    :showClear="!readonly"
    scrollHeight="230px"
    :placeholder="t('countries.select')"
    @update:modelValue="emit('country:selected', $event)"
  >
    <template #value="slotProps">
      <CountryItem
        v-if="slotProps.value"
        :countryCode="slotProps.value.alpha2Code"
      />
    </template>
    <template #option="slotProps">
      <CountryItem :countryCode="slotProps.option.alpha2Code" />
    </template>
    <template v-if="!!readonly" #dropdownicon>&nbsp;</template>
  </Dropdown>
</template>

<script lang="ts">
export default {
  name: 'Countrieselector',
}
</script>
