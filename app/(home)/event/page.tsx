import {ListEvent} from "@/components/events/list-event";
import {getEvents} from "@/db/query/event-query";

export default async function EventsPage() {
  const events = await getEvents()
  return (
    <div className="mx-auto max-w-5xl p-6 lg:px-8">
      <ListEvent events={events} />
    </div>
  );
}