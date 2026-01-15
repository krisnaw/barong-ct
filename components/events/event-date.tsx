import {toZonedTime} from "date-fns-tz";
import {formatEventDate, formatEventTime} from "@/types/date-helper";

export function EventDate({eventDate, type = "date"} : {eventDate: Date, type: string}) {
  const zonedDate = toZonedTime(eventDate, 'Asia/Singapore')
  return (
    <>
      {type === "date"  ? formatEventDate(zonedDate) : formatEventTime(zonedDate)}
    </>
  )
}