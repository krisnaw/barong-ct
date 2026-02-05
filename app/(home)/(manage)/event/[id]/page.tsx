import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);

  if (!event) {
    redirect('/');
  }

  if (event.price) {
    redirect(`/event/${id}/category`)
  }

  return (
    <div>
    </div>
  )
}