import {getEventById} from "@/db/query/event-query";
import {createOrderAction} from "@/app/actions/event-order/event-order.action";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect('/auth/signup')
  }

  const event = await getEventById(id)

  if (!event) {
    redirect('/event');
  }

  const payload = {
    userId: session.user.id,
    eventId: id,
    jerseyGender: "",
    status: "draft",
    price: event.price,
    currency: event.currency,
  }

  await createOrderAction(payload)

  return (
    <div>
      Creating order
    </div>
  )
}