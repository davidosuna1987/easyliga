import locales from '@/locales'
import es from '@/locales/es.json'
import en from '@/locales/en.json'

export default defineI18nConfig(() => {
  const FALLBACK_LOCALE = 'es'

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
