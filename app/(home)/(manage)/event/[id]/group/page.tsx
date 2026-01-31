import {getEventById} from "@/db/query/event-query";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);

  return (
    <div>
      Select Group
      <div>
        <input type="text"/>
      </div>
    </div>
  )
}