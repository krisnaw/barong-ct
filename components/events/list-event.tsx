import {EventType} from "@/db/schema";
import {ListItemEvent} from "@/components/events/list-item-event";

export function ListEvent({events} : {events: EventType[]}) {
  return (
    <div className="flex w-full flex-col gap-6">
      {events.map(event => (
        <ListItemEvent event={event} key={event.id} />
      ))}
    </div>
  )
}