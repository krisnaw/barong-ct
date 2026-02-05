import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getOrderByIdAndUser} from "@/db/query/event-order.query";
import {getPaymentByOrder} from "@/db/query/event-payment.query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

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

  return (
    <div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-pink-300 border-t border-b border-pink-500">
              <div  className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-muted-foreground">Jersey</dt>
                <dd className="whitespace-nowrap  font-bold">M</dd>
              </div>
            </dl>

            <dl className="divide-y divide-pink-300 border-b border-pink-500">
              <div  className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-muted-foreground">Group</dt>
                <dd className="whitespace-nowrap  font-bold">M</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment detail</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-pink-300 border-t border-b border-pink-500">
              <div  className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-muted-foreground">Jersey</dt>
                <dd className="whitespace-nowrap  font-bold">M</dd>
              </div>
            </dl>

            <dl className="divide-y divide-pink-300 border-b border-pink-500">
              <div  className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-muted-foreground">Group</dt>
                <dd className="whitespace-nowrap  font-bold">M</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>



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