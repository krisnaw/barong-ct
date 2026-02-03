import {StepProfile} from "@/components/checkout/step-profile";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getUserWithDetail} from "@/db/query/user-query";
import {redirect} from "next/navigation";
import {getOngoingOrder} from "@/db/query/event-order.query";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect(`/auth/signup`)
  }

  const user = await getUserWithDetail(session.user.id)
  const order = await getOngoingOrder(id, user.id)
  if (!order) {
    redirect("/event")
  }
  return (
    <div>
      <StepProfile user={user} order={order}  />
    </div>
  )
}