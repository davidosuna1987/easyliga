<script setup lang="ts">
import { Country, CountryCode, countries } from '@/domain/country'

const props = defineProps({
  countryCode: {
    type: String as PropType<CountryCode>,
    required: true,
  },
  size: {
    type: String as PropType<string>,
    default: '1.5rem',
  },
})

const { locale } = useI18n()

const country = computed((): Country | undefined =>
  countries.find(c => c.alpha2Code === props.countryCode),
)
</script>

<template>
  <div
    class="easy-country-item-component flex gap-2 justify-start items-center"
  >
    <FlagIcon :countryCode="countryCode" :size="size" />
    <span>{{ country?.translations[locale] ?? countryCode }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CountryItem',
}
</script>
