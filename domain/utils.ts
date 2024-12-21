import { ApiDuration } from '@/types/api/utils'
import { getISOByLocale } from '@/domain/locale'

const app = useNuxtApp()

export const SEARCH_MIN_LENGTH = 3

export type NestedArray<T = any> = T | NestedArray<T>[]

export type Duration = {
  hours: number
  minutes: number
  seconds: number
}

export const DurationScopes = {
  hours: 'hours',
  minutes: 'minutes',
  seconds: 'seconds',
} as const

export type DurationScope = keyof typeof DurationScopes

export const mapApiDurationToDuration = (
  apiDuration?: ApiDuration | null,
): Duration | undefined => (apiDuration ? { ...apiDuration } : undefined)

export const formatDate = (
  date?: string | Date,
  separator = '.',
  reverse = false,
) => {
  if (!date) return ''
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return reverse
    ? `${year}${separator}${month}${separator}${day}`
    : `${day}${separator}${month}${separator}${year}`
}

export const formatDateTime = (date?: string | Date, separator = '.') => {
  if (!date) return ''
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day}${separator}${month}${separator}${year} ${hours}:${minutes}`
}

export const formatTime = (
  date: string,
  scope: DurationScope = DurationScopes.minutes,
): string => {
  const d = new Date(date)
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const seconds = d.getSeconds().toString().padStart(2, '0')
  if (scope === DurationScopes.hours) return `${hours}`
  if (scope === DurationScopes.minutes) return `${hours}:${minutes}`
  return `${hours}:${minutes}:${seconds}`
}

export const formatDateByLocale = (date: string | Date, locale: string) =>
  new Intl.DateTimeFormat(getISOByLocale(locale), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date))

export const mapIndexToLocaleDateIndex = (index: number) =>
  index === 6 ? 0 : index + 1

export const sumDurations = (durations: Duration[]): Duration => {
  const totalSeconds = durations.reduce(
    (acc, duration) =>
      acc + duration.hours * 3600 + duration.minutes * 60 + duration.seconds,
    0,
  )

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

export const formatDuration = (
  duration: Duration,
  scope: DurationScope = DurationScopes.minutes,
) => {
  if (scope === DurationScopes.hours)
    return `${duration.hours}${app.$i18n.t('duration.short.hours')}`
  if (scope === DurationScopes.minutes)
    return `${duration.hours}${app.$i18n.t('duration.short.hours')} ${
      duration.minutes
    }${app.$i18n.t('duration.short.minutes')}`
  return `${duration.hours}${app.$i18n.t('duration.short.hours')} ${
    duration.minutes
  }${app.$i18n.t('duration.short.minutes')} ${duration.seconds}${app.$i18n.t(
    'duration.short.seconds',
  )}`
}

export const mapDurationTo = (
  duration: Duration,
  scope: DurationScope,
): number => {
  if (scope === DurationScopes.hours) return duration.hours
  if (scope === DurationScopes.minutes)
    return duration.hours * 60 + duration.minutes
  return duration.hours * 3600 + duration.minutes * 60 + duration.seconds
}

export const getInitials = (segments: string[]): string =>
  segments
    .map(s => s[0])
    .join('')
    .toLocaleUpperCase()

export const equalObjects = <T extends Record<string, any>>(
  obj1: T | undefined,
  obj2: T | undefined,
): boolean => {
  if (obj1 === obj2) return true

  if (
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object' ||
    obj1 === null ||
    obj2 === null
  ) {
    return false
  }

  // Check if they have the same number of keys
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  // Verify that all values and properties are equal
  for (let key of keys1) {
    // Ensure it's an object before doing recursive comparison
    if (!keys2.includes(key) || !equalObjects(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

export const formatMoney = (
  amount: number,
  currency: string = 'EUR',
  removeZeros: boolean = false,
  emptyDefault: string | undefined,
) => {
  if (amount <= 0 && emptyDefault) return emptyDefault

  let formatConfig: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol',
  }

  let formatted = new Intl.NumberFormat('es-ES', formatConfig).format(amount)
  if (removeZeros) formatted = formatted.replace('.00', '')
  formatted = formatted.replace('US$', '$ ')
  return formatted
}

export const formatNumber = (
  amount: number,
  removeZeros: boolean = false,
  emptyDefault?: string,
) => {
  if (amount <= 0 && emptyDefault) return emptyDefault

  const money = formatMoney(amount, 'EUR', removeZeros, emptyDefault)
  return money.slice(2)
}

export const $ = (selector: string): HTMLElement | null =>
  document.querySelector(selector)

export const $$ = (selector: string): NodeListOf<HTMLElement> =>
  document.querySelectorAll(selector)
