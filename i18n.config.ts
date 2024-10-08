import es from '@/locales/es.json'
import ct from '@/locales/ct.json'
import pv from '@/locales/pv.json'
import en from '@/locales/en.json'
import { locales } from '@/config/locale'
import { FALLBACK_LOCALE } from '@/domain/locale'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: localStorage.getItem('locale') ?? FALLBACK_LOCALE,
    locales,
    warnHtmlMessage: false,
    fallbackLocale: FALLBACK_LOCALE,
    messages: {
      es,
      ct,
      pv,
      en,
    },
  }
})
