import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getOrderByIdAndUser} from "@/db/query/event-order.query";
import {getPaymentByOrder} from "@/db/query/event-payment.query";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {formatBibNumber, formatMoney} from "@/utils/money-helper";
import {SERVICE_FEE} from "@/types/constant";
import {Badge} from "@/components/ui/badge";
import {getParticipantByEventUser} from "@/db/query/participant-query";

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


  const [order, payment, participant] = await Promise.all([
     getOrderByIdAndUser(Number(orderId), session.user.id),
     getPaymentByOrder(Number(orderId)),
     getParticipantByEventUser(id, session.user.id)
  ])

  if (!payment || !order) {
    redirect(`/event`);
  }

  return (
    <div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Registrations</CardTitle>
            {participant && (
              <CardAction>
                <Badge className="uppercase bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                  {participant?.status}
                </Badge>
              </CardAction>
            )}

          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 border-t border-b border-gray-200">
              <div  className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-muted-foreground">Jersey</dt>
                <dd className="whitespace-nowrap  font-bold">{order.jerseySize}</dd>
              </div>

              <div  className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-muted-foreground">Group</dt>
                <dd className="whitespace-nowrap  font-bold">M</dd>
              </div>

              {participant && participant.bibNumber && (
                <div  className="flex justify-between py-3 text-sm font-medium">
                  <dt className="text-muted-foreground">BIB Number</dt>
                  <dd className="whitespace-nowrap  font-bold">{formatBibNumber(participant.bibNumber)}</dd>
                </div>
              )}

            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment detail</CardTitle>
            <CardDescription>{payment.invoiceNumber}</CardDescription>
            <CardAction>
              <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                {payment.status}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <dt>Registration fee</dt>
                  <dd className="text-gray-900">{formatMoney(Number(event.price))}</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Service fee</dt>
                  <dd className="text-gray-900">{formatMoney(Number(SERVICE_FEE))}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                    {formatMoney(Number(event.price) + SERVICE_FEE)}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}