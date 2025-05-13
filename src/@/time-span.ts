export type TimeSpan = {
  type: 'TimeSpan'
  _durationMilliseconds: number
}

const milliseconds = (durationMilliseconds: number): TimeSpan => {
  return {
    type: 'TimeSpan',
    _durationMilliseconds: ensureCleanNonNegativeNumber(durationMilliseconds),
  }
}

const seconds = (durationSeconds: number): TimeSpan => {
  return milliseconds(durationSeconds * 1000)
}

const minutes = (durationMinutes: number): TimeSpan => {
  return seconds(durationMinutes * 60)
}

const hours = (durationHours: number): TimeSpan => {
  return minutes(durationHours * 60)
}

const days = (durationDays: number): TimeSpan => {
  return hours(durationDays * 24)
}

const weeks = (durationWeeks: number): TimeSpan => {
  return days(durationWeeks * 7)
}

const years = (durationYears: number): TimeSpan => {
  return days(durationYears * 365)
}

const toMilliseconds = (timeSpan: TimeSpan): number => {
  return timeSpan._durationMilliseconds
}

const toSeconds = (timeSpan: TimeSpan): number => {
  return toMilliseconds(timeSpan) / 1000
}

const toMinutes = (timeSpan: TimeSpan): number => {
  return toSeconds(timeSpan) / 60
}

const toHours = (timeSpan: TimeSpan): number => {
  return toMinutes(timeSpan) / 60
}

const toDays = (timeSpan: TimeSpan): number => {
  return toHours(timeSpan) / 24
}

const toWeeks = (timeSpan: TimeSpan): number => {
  return toDays(timeSpan) / 7
}

const add = (left: TimeSpan, right: TimeSpan): TimeSpan => {
  return milliseconds(toMilliseconds(left) + toMilliseconds(right))
}

const subtract = (left: TimeSpan, right: TimeSpan): TimeSpan => {
  return milliseconds(toMilliseconds(left) - toMilliseconds(right))
}

const scale = (timeSpan: TimeSpan, factor: number): TimeSpan => {
  return milliseconds(toMilliseconds(timeSpan) * factor)
}

const encodingKey = 'TimeSpan'
const delimiter = ':'
const encode = (timeSpan: TimeSpan): string => {
  return [encodingKey, delimiter, timeSpan._durationMilliseconds].join('')
}

const decode = (encoded: string): TimeSpan | null => {
  const [key, value] = encoded.split(delimiter)
  if (typeof key !== 'string') {
    return null
  }
  if (typeof value !== 'string') {
    return null
  }
  if (key !== encodingKey) {
    return null
  }
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed)) {
    return null
  }
  return {
    type: 'TimeSpan',
    _durationMilliseconds: parsed,
  }
}

const eq = (left: TimeSpan, right: TimeSpan): boolean => {
  return toMilliseconds(left) === toMilliseconds(right)
}

const gt = (left: TimeSpan, right: TimeSpan): boolean => {
  return toMilliseconds(left) > toMilliseconds(right)
}

const lt = (left: TimeSpan, right: TimeSpan): boolean => {
  return toMilliseconds(left) < toMilliseconds(right)
}

const gte = (left: TimeSpan, right: TimeSpan): boolean => {
  return toMilliseconds(left) >= toMilliseconds(right)
}

const lte = (left: TimeSpan, right: TimeSpan): boolean => {
  return toMilliseconds(left) <= toMilliseconds(right)
}

/**
 *
 *
 *
 *
 */

export const TRANSLATIONS = {
  year: {
    singular: 'year',
    plural: (amount: number) => `${amount} years`,
  },
  month: {
    singular: 'month',
    plural: (amount: number) => `${amount} months`,
  },
  day: {
    singular: 'day',
    plural: (amount: number) => `${amount} days`,
  },
  hour: {
    singular: 'hour',
    plural: (amount: number) => `${amount} hours`,
  },
  minute: {
    singular: 'minute',
    plural: (amount: number) => `${amount} minutes`,
  },
  second: {
    singular: 'second',
    plural: (amount: number) => `${amount} seconds`,
  },
  moment: 'moment ago',
}
const humanFriendlyString = (timeSpan: TimeSpan): string => {
  const seconds = toSeconds(timeSpan)
  const days = seconds / 86400 // Convert seconds to days

  if (days >= 365) {
    const years = days / 365
    return years >= 2 ? TRANSLATIONS.year.plural(years) : TRANSLATIONS.year.singular
  }

  if (days >= 30) {
    const months = days / 30
    return months >= 2 ? TRANSLATIONS.month.plural(months) : TRANSLATIONS.month.singular
  }

  if (days >= 1) {
    return days >= 2 ? TRANSLATIONS.day.plural(days) : TRANSLATIONS.day.singular
  }

  const hours = seconds / 3600
  if (hours >= 1) {
    return hours >= 2 ? TRANSLATIONS.hour.plural(hours) : TRANSLATIONS.hour.singular
  }

  const minutes = seconds / 60
  if (minutes >= 1) {
    return minutes >= 2 ? TRANSLATIONS.minute.plural(minutes) : TRANSLATIONS.minute.singular
  }

  return TRANSLATIONS.moment
}

const negate = (timeSpan: TimeSpan): TimeSpan => {
  return milliseconds(-toMilliseconds(timeSpan))
}

/**
 * @description
 * `TimeSpan` represents a duration of time.
 */
export const TimeSpan = {
  humanFriendlyString,
  negate,
  //
  //
  //
  milliseconds,
  seconds,
  minutes,
  hours,
  days,
  years,
  weeks,
  //
  //
  //
  toMilliseconds,
  toSeconds,
  toMinutes,
  toHours,
  toDays,
  toWeeks,
  //
  //
  //
  add,
  subtract,
  scale,
  //
  //
  //
  eq,
  gt,
  lt,
  gte,
  lte,
  //
  //
  //
  encode,
  decode,
  TRANSLATIONS,
}

const ensureCleanNonNegativeNumber = (value: number | undefined): number => {
  if (value === undefined) return 0
  if (isNaN(value)) return 0
  if (value < 0) return 0
  if (value === Infinity) return 0
  return value
}
