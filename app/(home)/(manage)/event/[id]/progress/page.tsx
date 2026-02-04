import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getOrderByIdAndUser} from "@/db/query/event-order.query";
import {getPaymentByOrder} from "@/db/query/event-payment.query";
import {Card} from "@/components/ui/card";

export default async function Page({params, searchParams}: { params: Promise<{ id: number }> , searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
  const {id} = await params;
  const orderId = (await searchParams).orderId;

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect("/auth/signup");
  }

  const event = await getEventById(id)
  if (!event || !orderId) {
    redirect(`/event`);
  }


  const order = await getOrderByIdAndUser(Number(orderId), session.user.id);
  const payment = await getPaymentByOrder(Number(orderId));

  if (!payment || !order) {
    redirect(`/event`);
  }

  if (!payment.invoiceNumber) {
    redirect(`/event`);
  }

  // if (order.status === "payment" && payment.status === "PENDING") {
  //   await checkPaymentStatus(payment.invoiceNumber)
  // }

  return (
    <div>
      <Card>
        Order Card
        <div>
          {order.status}
        </div>
      </Card>

      <Card>
        Payment Card
        <div>
          {payment.invoiceNumber} - {payment.status}
        </div>
      </Card>
    </div>
  )
}