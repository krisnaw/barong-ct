import {getEvents} from "@/db/query/event-query";
import {ListItemEvent} from "@/components/events/list-item-event";

export default async function EventsPage() {
  const events = await getEvents()
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 pt-24 pb-24">
        <div className="flex flex-col gap-6">
          {events.map(event => (
            <ListItemEvent event={event} key={event.id} />
          ))}
        </div>
      </div>
    </div>
  );
}