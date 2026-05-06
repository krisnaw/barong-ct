import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {createOrderAction} from "@/app/actions/event-order/event-order.action";
import {getEventById} from "@/db/query/event-query";

export default async function Page({params, searchParams}: { params: Promise<{ id: number }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {

  const {id} = await params;
  const group = (await searchParams).group
  console.log(group)
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
      ...(group && { groupId: Number(group) })
    }
    await createOrderAction(payload)
  }

  // Always redirect to order
  if (order) {
    switch (order.status) {
      case "draft":
      case "group":
        return event.isGroupRide == 0 ?  redirect(`/event/${id}/profile?orderId=${order.id}`) : redirect(`/event/${id}/category?orderId=${order.id}`)
      case "profile":
        return redirect(`/event/${id}/payment?orderId=${order.id}`)
      case "payment":
        return redirect(`/event/${id}/payment?orderId=${order.id}`)
      case "paid":
        return    redirect(`/event/${id}`)
      default:
        return (
          <div>
            Sorry, something wrong.
          </div>
        )
    }
  }

  return (
    <div>
      Creating order...
    </div>
  )
}