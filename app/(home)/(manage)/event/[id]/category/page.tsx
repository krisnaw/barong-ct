import {CategorySelection} from "@/components/checkout/category-selection";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getEventById} from "@/db/query/event-query";
import {getGroupByEvent} from "@/db/query/event-group.query";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const event = await getEventById(id)
  if (!event) {
    redirect(`/event`);
  }

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect('/auth/signup')
  }
  const userId = session.user.id;

  const order = await getOngoingOrder(id, userId);
  const groups = await getGroupByEvent(id);


  // if status payment or paid, go to complete page
  if (order && (order.status === 'payment' || order.status === 'paid')) {
    redirect(`/event/${id}/complete?orderId=${order.id}`)
  }

  return (
    <div>
      <CategorySelection event={event} order={order} groups={groups}  />
    </div>
  )
}