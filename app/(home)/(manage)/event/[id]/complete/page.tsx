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
import {getGroupById} from "@/db/query/event-group.query";
import {GroupWithParticipant} from "@/db/schema";
import {GroupItem} from "@/components/group/group-item";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {ReceiptIcon, TicketCheck} from "lucide-react";
import EventConfirmation from "@/app/(home)/(manage)/event/[id]/complete/event-confirmation";

export default async function Page({params, searchParams}: {
  params: Promise<{ id: number }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
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

  let group: GroupWithParticipant | null = null;
  if (order?.groupId) {
    group = await getGroupById(order?.groupId)
  }

  if (!payment || !order) {
    redirect(`/event`);
  }

  return (
    <div className="mx-auto max-w-lg">

      <div>
        <EventConfirmation />
      </div>

      <div className="space-y-2">
        {group && (
          <GroupItem group={group}/>
        )}

        <Item variant="outline">
          <ItemMedia variant="icon">
            <ReceiptIcon/>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Payment</ItemTitle>
            <ItemDescription>
              {payment.invoiceNumber}
            </ItemDescription>
          </ItemContent>
          <ItemContent className="flex-none text-center">
            <ItemDescription>
              <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                {payment.status}
              </Badge>
            </ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <TicketCheck/>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Registrations</ItemTitle>
            <ItemDescription>
              Transparent background with no border.
            </ItemDescription>
          </ItemContent>

          {participant && (
            <ItemContent className="flex-none text-center py-1">
              <ItemDescription>
                <Badge className="uppercase bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                  {participant?.status}
                </Badge>
              </ItemDescription>
            </ItemContent>
          )}

        </Item>

      </div>

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
              <div className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-muted-foreground">Jersey</dt>
                <dd className="whitespace-nowrap  font-bold">{order.jerseySize}</dd>
              </div>

              {group && (
                <div className="flex justify-between py-3 text-sm font-medium">
                  <dt className="text-muted-foreground">Group</dt>
                  <dd className="whitespace-nowrap  font-bold">{group.name}</dd>
                </div>
              )}

              {participant && participant.bibNumber && (
                <div className="flex justify-between py-3 text-sm font-medium">
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