import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {createOrderAction} from "@/app/actions/event-order/event-order.action";
import {ORDER_STATUS} from "@/utils/event.helper";

export default async function Page({params, searchParams}: {
  params: Promise<{ id: number }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const {id} = await params;
  const group = (await searchParams).group
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

  // TODO: CONTINUE this, use value from the event category
  if (!order) {
    const payload = {
      userId: userId,
      eventId: id,
      jerseyGender: "",
      status: "draft",
      price: 0,
      currency: 'IDR',
      ...(group && {groupId: Number(group)})
    }
    await createOrderAction(payload)
  }

  // Always redirect to order
  if (order) {
    const status = order.status;

    if (status == ORDER_STATUS.DRAFT) {
      if (event.isGroupRide && event.isGroupRide > 0) {
        redirect(`/event/${id}/register/group?orderId=${order.id}`)
      } else {
        redirect(`/event/${id}/register/profile?orderId=${order.id}`)
      }
    }

    if (status == ORDER_STATUS.PROFILE) {
      redirect(`/event/${id}/register/payment?orderId=${order.id}`)
    }

    if (status == ORDER_STATUS.PENDING_PAYMENT) {
      redirect(`/event/${id}/register/payment?orderId=${order.id}`)
    }

    if (status == ORDER_STATUS.COMPLETED) {
      redirect(`/event/${id}`)
    }
  }

  return (
    <div>
      Register
    </div>
  )
}