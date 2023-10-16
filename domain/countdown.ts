const MILLISECONDS_SECOND = 1000
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND
const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE
const MILLISECONDS_DAY = 24 * MILLISECONDS_HOUR

export type RemainingTime = {
  totalMilliseconds: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  ended: boolean
}

export const calculateRemainingTime = (timestamp: number): RemainingTime => {
  const now = new Date().getTime()
  const difference = timestamp - now

  const totalMilliseconds = difference

  const days = Math.floor(totalMilliseconds / MILLISECONDS_DAY)
  const hours = Math.floor(
    (totalMilliseconds % MILLISECONDS_DAY) / MILLISECONDS_HOUR,
  )
  const minutes = Math.floor(
    (totalMilliseconds % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE,
  )
  const seconds = Math.floor(
    (totalMilliseconds % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND,
  )
  const milliseconds = totalMilliseconds % MILLISECONDS_SECOND

  const ended = totalMilliseconds <= 0

  return {
    totalMilliseconds,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    ended,
  }
}

export const zeroPad = (value: number): string => String(value).padStart(2, '0')
