import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {createOrderAction} from "@/app/actions/event-order/event-order.action";
import {getEventById} from "@/db/query/event-query";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

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

  // Check to make sure user has an Order

  const userId = session.user.id;
  const order = await getOngoingOrder(id, userId);

  if (!order) {
    const payload = {
      userId: userId,
      eventId: id,
      jerseyGender: "",
      status: "draft",
      price: event.price,
      currency: event.currency,
    }
    await createOrderAction(payload)
  }

  // Always redirect to order
  if (order) {
    if (order.status === "draft" && (event.isGroupRide !== 0 || !event.isGroupRide)) {
      redirect(`/event/${id}/profile?orderId=${order.id}`)
    }

    if (order.status === "profile") {
      redirect(`/event/${id}/payment?orderId=${order.id}`)
    }
  }

  return (
    <div>
      Creating order...
    </div>
  )
}