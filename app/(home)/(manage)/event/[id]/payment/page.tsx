import {StepPayment} from "@/components/checkout/step-payment";
import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect(`/auth/signup`)
  }

  const event = await getEventById(id)
  if (!event) {
    redirect(`/event`);
  }

  const order = await getOngoingOrder(id, session.user.id)
  if (!order) {
    redirect("/event")
  }

  return (
    <div>
      <StepPayment event={event} order={order} />
    </div>
  )
}