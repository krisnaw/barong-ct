import {EventWithDetail} from "@/db/query/event-query";
import {EventCard} from "./event-card";

export function ListEvent({events}: { events: EventWithDetail[] }) {
  if (!events) return null;
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      {events.map((event : EventWithDetail) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}