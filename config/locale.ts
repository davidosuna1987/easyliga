import { Locale } from '@/types/lang'

export const FALLBACK_LOCALE = 'es'
export const LOCALE_FLAG_TYPE = '1x1'
export const FALLBACK_LOCALE_ICON = `flag:${FALLBACK_LOCALE}-${LOCALE_FLAG_TYPE}`

export const getLocaleIconName = (locale: string) =>
  `flag:${locale}-${LOCALE_FLAG_TYPE}`

export const locales: Locale[] = [
  {
    code: 'es',
    name: 'Español',
    iso: 'es-ES',
    file: 'es.json',
    flag: 'es',
  },
  {
    code: 'ct',
    name: 'Català',
    iso: 'es-CT',
    file: 'ct.json',
    flag: 'es-ct',
  },
  {
    code: 'pv',
    name: 'Euskera',
    iso: 'es-PV',
    file: 'pv.json',
    flag: 'es-pv',
  },
  {
    code: 'en',
    name: 'English',
    iso: 'en-EN',
    file: 'en.json',
    flag: 'gb',
  },
]
