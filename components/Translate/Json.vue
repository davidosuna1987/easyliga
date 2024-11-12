<script setup lang="ts">
import TranslateService from '@/services/translate'
import { TranslatedLocale, TranslateJsonRequest } from '@/domain/translate'
import { FALLBACK_LOCALE, LocaleCode } from '@/domain/locale'

const { t } = useI18n()
const toast = useEasyToast()

const translateService = new TranslateService()

const loadingApi = ref<boolean>(false)
const output = ref<TranslatedLocale>()
const form = ref<TranslateJsonRequest>({
  json: '',
  inputLocale:
    (localStorage.getItem('locale') as LocaleCode) || FALLBACK_LOCALE,
  outputLocales: [],
})
const errors = ref<Record<string, boolean>>({
  json: false,
  inputLocale: false,
  outputLocales: false,
})

const errorTranslation = computed((): string | undefined => {
  if (errors.value.json) return t('translate.json_required')
  if (errors.value.inputLocale) return t('translate.input_locale_required')
  if (errors.value.outputLocales) return t('translate.output_locales_required')
  return
})

const setErrors = () => {
  removeErrors()
  if (form.value.json.length < 3) errors.value.json = true
  if (!form.value.inputLocale) errors.value.inputLocale = true
  if (!form.value.outputLocales.length) errors.value.outputLocales = true
}

const removeErrors = () => {
  errors.value = {
    json: false,
    inputLocale: false,
    outputLocales: false,
  }
}

const setInputLocale = (locale: LocaleCode) => {
  form.value.inputLocale = locale
}

const setOutputLocales = (locales: LocaleCode[]) => {
  console.log({ locales })
  form.value.outputLocales = locales
}

const submit = () => {
  setErrors()

  if (errorTranslation.value) {
    toast.error(errorTranslation.value)
    return
  }

  handleSubmit()
}

const handleSubmit = async () => {
  loadingApi.value = true

  const { data, error } = await translateService.json(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success(t('translate.translated'))
    output.value = data.value.data.translated_locales
  }

  loadingApi.value = false
}
</script>

<template>
  <form
    :class="['easy-translate-json-component', { 'is-muted': loadingApi }]"
    @submit="submit"
  >
    <FormLabel class="mb-1" :label="t('translate.input_locale')" />
    <LangItemSelector @selected:single="setInputLocale" />

    <FormLabel class="mb-1" :label="t('translate.output_locales')" />
    <LangItemSelector
      :multiple="true"
      :exclude="[form.inputLocale]"
      showExcluded
      @selected:multiple="setOutputLocales"
    />

    <EasyGrid :breakpoints="{ md: 2 }" :gap="3">
      <FormLabel class="mb-1" :label="t('translate.json')">
        <Textarea
          v-model="form.json"
          class="w-full resize-none font-mono"
          :rows="20"
        />
      </FormLabel>
      <FormLabel class="mb-1" :label="t('translate.translation')">
        <Textarea
          :value="JSON.stringify(output, null, 2)"
          class="w-full resize-none font-mono"
          :rows="20"
          readonly
        />
      </FormLabel>
    </EasyGrid>

    <FormFooterActions
      :loading="loadingApi"
      :submitLabel="t('translate.translate')"
      hideCancel
      @form:submit="submit"
    />
  </form>
</template>

<style lang="scss">
.easy-translate-json-component {
  .easy-lang-item-component {
    cursor: pointer;
    border: solid 1px var(--input-border-color);
    border-radius: 1rem;
    padding-block: 0.15rem;
    padding-inline-start: 0.15rem;
    padding-inline-end: 0.5rem;

    &:hover {
      color: var(--primary-color);
    }

    &.is-active {
      background-color: var(--primary-color);
      color: var(--primary-color-text);

      .easy-lang-icon-component {
        border: solid 1px var(--primary-color-text) !important;
      }
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'TranslateJson',
}
</script>
