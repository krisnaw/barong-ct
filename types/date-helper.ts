import {format, toZonedTime} from "date-fns-tz"

const lang = "en-GB"

export function formatEventDate(date: Date) {
  const res  = new Intl.DateTimeFormat(lang, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Singapore", // GMT+8
  }).format(date)

  console.log(res.toString())

  return res;
}



export function formatEventTime(date: Date) {
  return new Intl.DateTimeFormat(lang, {
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