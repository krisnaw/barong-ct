import {getEventById} from "@/db/query/event-query";
import {SearchGroupInput} from "@/components/checkout/search-group-input";
import {getGroupByEvent} from "@/db/query/event-group.query";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);
  const groups = await getGroupByEvent(id)

  return (
    <div>
      <SearchGroupInput eventId={id} availableGroups={groups} />
    </div>
  )
}