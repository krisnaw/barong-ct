import {getCategoryByEvent} from "@/db/query/event-category.query";
import {CategorySelection} from "@/components/checkout/category-selection";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getEventById} from "@/db/query/event-query";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const event = await getEventById(id)
  if (!event) {
    redirect(`/event`);
  }
  const categories = await getCategoryByEvent(id)
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
      <CategorySelection event={event} categories={categories} order={order}  />
    </div>
  )
}