import {getEvents} from "@/db/query/event-query";
import {ListItemEvent} from "@/components/events/list-item-event";

export default async function EventsPage() {
  const events = await getEvents()
  return (
    <div className="mx-auto max-w-5xl p-6 lg:px-8">
      <div className="flex w-full max-w-lg mx-auto flex-col gap-6">
        {events.map(event => (
          <ListItemEvent event={event} key={event.id} />
        ))}
      </div>
    </div>
  );
}