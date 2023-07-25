export type Locale = {
  code: string
  name: string
  iso: string
  file: string
}

export type I18n = {
  locale: {
    value: string
  }
}

export const FALLBACK_LOCALE = 'es'

export const setAppLocale = (i18n: I18n, selectedLocale: string) => {
  i18n.locale.value = selectedLocale
  localStorage.setItem('locale', selectedLocale)
}
