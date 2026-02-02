import {StepPayment} from "@/components/checkout/step-payment";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getOngoingOrder} from "@/db/query/event-order.query";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect('/auth/signup')
  }
  const userId = session.user.id;

  const order = await getOngoingOrder(id, userId)

  return (
    <div>
      <StepPayment  />
    </div>
  )
}