import { I18n } from 'types/lang'

export const FALLBACK_LOCALE = 'es'

export const setAppLocale = (i18n: I18n, selectedLocale: string) => {
  i18n.locale.value = selectedLocale
  localStorage.setItem('locale', selectedLocale)
}
