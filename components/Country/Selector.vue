<script setup lang="ts">
import { useCountryStore } from '@/stores/useCountryStore'
import { Country, getCountryFlagIconName } from '@/domain/country'

const { t, locale } = useI18n()
const countryStore = useCountryStore()

const countries = ref<Country[]>(countryStore.countries)
const selectedCountry = ref<Country>()
</script>

<template>
  <Dropdown
    class="easy-countries-selector-component"
    v-model="selectedCountry"
    :options="countries"
    :optionLabel="`translations.${locale}`"
    :filter="true"
    :filterLocale="locale"
    :filterPlaceholder="$t('countries.search')"
    :emptyFilterMessage="t('forms.no_results_found')"
    :showClear="true"
    scrollHeight="230px"
    :placeholder="$t('countries.select')"
    @update:modelValue="$emit('selected', $event)"
  >
    <template #value="slotProps">
      <div class="flex gap-2 justify-start items-center" v-if="slotProps.value">
        <FlagIcon :countryCode="slotProps.value.alpha2Code" size="1.5rem" />
        <span>{{ slotProps.value.translations[locale] }}</span>
      </div>
    </template>
    <template #option="slotProps">
      <div class="flex gap-2 justify-start items-center">
        <FlagIcon :countryCode="slotProps.option.alpha2Code" size="1.5rem" />
        <span>{{ slotProps.option.translations[locale] }}</span>
      </div>
    </template>
  </Dropdown>
</template>

<script lang="ts">
export default {
  name: 'Countrieselector',
}
</script>
