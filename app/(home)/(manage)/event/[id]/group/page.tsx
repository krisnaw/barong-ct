import {SearchGroupInput} from "@/components/checkout/search-group-input";
import {getGroupByEvent} from "@/db/query/event-group.query";
import {GroupList} from "@/components/checkout/group-list";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const groups = await getGroupByEvent(id)

  return (
    <div>
      <SearchGroupInput eventId={id} availableGroups={groups} />
      <GroupList groups={groups} />
    </div>
  )
}