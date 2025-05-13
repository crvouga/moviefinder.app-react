import { describe, expect, test } from 'bun:test'
import { TimeSpan } from './time-span'

describe('TimeSpan', () => {
  test("should return 'X year(s) ago' for year intervals", () => {
    expect(TimeSpan.humanFriendlyString(TimeSpan.days(365))).toBe(
      TimeSpan.TRANSLATIONS.year.singular
    )
    expect(TimeSpan.humanFriendlyString(TimeSpan.days(365 * 2))).toBe(
      TimeSpan.TRANSLATIONS.year.plural(2)
    )
  })

  test.skip("should return 'X month(s) ago' for month intervals", () => {
    expect(TimeSpan.humanFriendlyString(TimeSpan.days(32))).toBe(
      TimeSpan.TRANSLATIONS.month.singular
    )
    expect(TimeSpan.humanFriendlyString(TimeSpan.days(64))).toBe(
      TimeSpan.TRANSLATIONS.month.plural(2)
    )
  })

  test("should return 'X day(s) ago' for day intervals", () => {
    expect(TimeSpan.humanFriendlyString(TimeSpan.days(1))).toBe(TimeSpan.TRANSLATIONS.day.singular)
    expect(TimeSpan.humanFriendlyString(TimeSpan.days(2))).toBe(TimeSpan.TRANSLATIONS.day.plural(2))
  })

  test("should return 'X hour(s) ago' for hour intervals", () => {
    expect(TimeSpan.humanFriendlyString(TimeSpan.hours(1))).toBe(
      TimeSpan.TRANSLATIONS.hour.singular
    )
    expect(TimeSpan.humanFriendlyString(TimeSpan.hours(2))).toBe(
      TimeSpan.TRANSLATIONS.hour.plural(2)
    )
  })

  test("should return 'X minute(s) ago' for minute intervals", () => {
    expect(TimeSpan.humanFriendlyString(TimeSpan.minutes(1))).toBe(
      TimeSpan.TRANSLATIONS.minute.singular
    )
    expect(TimeSpan.humanFriendlyString(TimeSpan.minutes(2))).toBe(
      TimeSpan.TRANSLATIONS.minute.plural(2)
    )
  })

  test("should return 'A moment ago' for intervals less than a minute", () => {
    expect(TimeSpan.humanFriendlyString(TimeSpan.seconds(30))).toBe(TimeSpan.TRANSLATIONS.moment)
  })
})
