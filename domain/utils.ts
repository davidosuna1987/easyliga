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

export type DurationScope = (typeof DurationScopes)[keyof typeof DurationScopes]

export const mapApiDurationToDuration = (
  apiDuration: ApiDuration | null,
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
