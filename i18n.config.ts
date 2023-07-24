import locales from '@/locales'
import es from '@/locales/es.json'
import en from '@/locales/en.json'
import { FALLBACK_LOCALE } from '@/domain/lang/lang'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: localStorage.getItem('locale') ?? FALLBACK_LOCALE,
    locales,
    warnHtmlMessage: false,
    fallbackLocale: FALLBACK_LOCALE,
    messages: {
      es,
      en,
    },
  }
})
