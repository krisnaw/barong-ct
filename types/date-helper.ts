import {format, toZonedTime} from "date-fns-tz"

export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Singapore", // GMT+8
  }).format(date)
}


export function formatEventTime(date: Date, locale = "id-ID") {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Singapore", // GMT+8
    timeZoneName: "short",
  }).format(date)
}

export function eventDateFormat(
  utcDate: Date | string,
  timeZone = "Asia/Singapore"
) {
  const date =
    typeof utcDate === "string" ? new Date(utcDate) : utcDate

  const zoned = toZonedTime(date, timeZone)

  return format(zoned, "EEE, MMM d · HH:mm", {
    timeZone,
  })
}

export const emptyBanner = "https://placeholdit.com/400x400/f3f4f6/9da8bf?text=Banner"