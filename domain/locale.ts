import {
  locales,
  FALLBACK_LOCALE_ICON,
  getLocaleIconName,
} from '@/config/locale'

export const getLangIcon = (locale: string): string => {
  const flag =
    locales.find(item => item.code === locale)?.flag ?? FALLBACK_LOCALE_ICON
  return getLocaleIconName(flag)
}
