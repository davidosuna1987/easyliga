<script setup lang="ts">
import { locales } from '@/config/locale'
import { FALLBACK_LOCALE, LocaleCode } from '@/domain/locale'

const props = defineProps({
  default: {
    type: String as PropType<LocaleCode>,
    required: false,
    default: localStorage.getItem('locale') || FALLBACK_LOCALE,
  },
  exclude: {
    type: Array as PropType<LocaleCode[]>,
    required: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  hideExcluded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'selected:single', value: LocaleCode): void
  (e: 'selected:multiple', value: LocaleCode[]): void
}>()

const selectedLocales = ref<LocaleCode[]>(props.multiple ? [] : [props.default])

const notExcludedLocales = computed(() =>
  props.hideExcluded
    ? locales.filter(locale => !isExcluded(locale.code))
    : locales,
)

const isExcluded = (code: LocaleCode) => {
  return !!props.exclude && props.exclude.includes(code)
}

const setSelectedLocale = (code: LocaleCode) => {
  selectedLocales.value = [code]
}

const toggleOutputLocale = (code: LocaleCode) => {
  const index = selectedLocales.value.indexOf(code)
  if (index === -1) {
    selectedLocales.value.push(code)
  } else {
    selectedLocales.value.splice(index, 1)
  }
}

const handleClick = (code: LocaleCode) => {
  if (isExcluded(code)) return

  if (props.multiple) {
    toggleOutputLocale(code)
  } else {
    setSelectedLocale(code)
  }
}

watch(selectedLocales, value => {
  if (props.multiple) {
    emit('selected:multiple', value)
  } else {
    emit('selected:single', value[0])
  }
})

watch(
  () => props.exclude,
  value => {
    if (!!value) {
      selectedLocales.value = selectedLocales.value.filter(
        locale => !isExcluded(locale),
      )
    }
  },
)
</script>

<template>
  <div class="easy-lang-item-selector-component lang-item flex gap-3 mb-4">
    <LangItem
      v-for="locale of notExcludedLocales"
      :class="[
        {
          'is-active': selectedLocales.includes(locale.code),
          'is-muted': isExcluded(locale.code),
        },
      ]"
      :item="locale"
      @click="handleClick(locale.code)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'LangItemSelector',
}
</script>
