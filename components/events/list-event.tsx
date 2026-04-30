import {EventType} from "@/db/schema";
import {ListItemEvent} from "@/components/events/list-item-event";

export function ListEvent({events}: { events: (EventType & { participantCount?: number })[] }) {
  return (
    <div className="flex w-full max-w-lg mx-auto flex-col gap-6">
      {events.map(event => (
        <ListItemEvent event={event} key={event.id} />
      ))}
    </div>
  )
}