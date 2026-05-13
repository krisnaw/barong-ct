import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getOrderByIdAndUser} from "@/db/query/event-order.query";
import {getPaymentByOrder} from "@/db/query/event-payment.query";
import {getParticipantByEventUser} from "@/db/query/participant-query";
import {getGroupById} from "@/db/query/event-group.query";
import {GroupWithParticipant} from "@/db/schema";
import {GroupItem} from "@/components/group/group-item";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {ReceiptIcon, TicketCheck} from "lucide-react";

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



      <div className="space-y-2.5">



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
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                {payment.status}
              </span>
            </ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <TicketCheck/>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Registrations</ItemTitle>
          </ItemContent>

          {participant && (
            <ItemContent className="flex-none text-center py-1">
              <ItemDescription>
                <span className="uppercase inline-flex items-center rounded-fullg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {participant?.status}
                </span>
              </ItemDescription>
            </ItemContent>
          )}

        </Item>

      </div>



    </div>
  )
}