
export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date)
}


export function formatEventTime(date: Date, locale = "id-ID") {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}