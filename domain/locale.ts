import { locales } from '@/config/locale'

export const FALLBACK_ISO = 'es-ES'
export const FALLBACK_LOCALE = 'es'
export const LOCALE_FLAG_TYPE = '1x1'
export const FALLBACK_LOCALE_ICON = `flag:${FALLBACK_LOCALE}-${LOCALE_FLAG_TYPE}`

export type LocaleObject = (typeof locales)[number]
export type LocaleISO = LocaleObject['iso']
export type LocaleCode = LocaleObject['code']

export const getLocaleIconName = (locale: string) =>
  `flag:${locale}-${LOCALE_FLAG_TYPE}`

export const getISOByLocale = (locale: string): LocaleISO =>
  locales.find(l => l.code === locale)?.iso ?? FALLBACK_ISO

export const getLangIcon = (locale: string): string => {
  const flag =
    locales.find(item => item.code === locale)?.flag ?? FALLBACK_LOCALE_ICON
  return getLocaleIconName(flag)
}
