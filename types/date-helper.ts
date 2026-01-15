
export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
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

export const emptyBanner = "https://placeholdit.com/400x400/f3f4f6/9da8bf?text=Banner"