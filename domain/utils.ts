import { ApiDuration } from '@/types/api/utils'

const app = useNuxtApp()

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

export const formatDate = (date: string, separator = '.') => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}${separator}${month}${separator}${year}`
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
