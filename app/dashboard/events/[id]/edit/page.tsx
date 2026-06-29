import {EditEventForm} from "@/components/events/edit-event-form";
import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {BackButton} from "@/components/button/back-button";

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
    <div className="max-w-xl space-y-4">
      <BackButton href={`/dashboard/events/${id}`}>Back to event</BackButton>
      <EditEventForm event={event} />
    </div>
  )
}
