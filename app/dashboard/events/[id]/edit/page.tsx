import {EditEventForm} from "@/components/events/edit-event-form";
import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ id: number }>
}) {

  const {id} = await params;

  const event = await getEventById(id);

  if (!event) {
    redirect('/dashboard');
  }

  return (
    <div>
      <EditEventForm event={event} />
    </div>
  )
}