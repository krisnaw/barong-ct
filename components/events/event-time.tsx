import {toZonedTime} from "date-fns-tz";
import {formatEventTime} from "@/types/date-helper";

export function EventTime({eventDate} : {eventDate: Date}) {
  const zonedDate = toZonedTime(eventDate, 'Asia/Singapore')
  console.log(zonedDate);
  return (
    <>
      {formatEventTime(zonedDate)}
    </>
  )
}