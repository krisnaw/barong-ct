import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {MapPin, TicketCheck} from "lucide-react";
import {EventCard} from "@/components/events/event-card";
import {getPaymentByOrder} from "@/db/query/event-payment.query";
import {EventPaymentCard} from "@/components/events/event-payment-card";
import {getParticipantByEventUser} from "@/db/query/participant-query";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import * as React from "react";
import {formatBibNumber} from "@/utils/money-helper";
import {checkPaymentStatus} from "@/app/actions/payment/payment-status.action";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {getGroupById} from "@/db/query/event-group.query";
import {GroupItem} from "@/components/group/group-item";
import {InviteItem} from "@/app/(home)/(manage)/event/[id]/invite-item";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);

  if (!event) {
    redirect('/');
  }

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })
  if (!session) {
    redirect('/auth/signup')
  }


  const userId = session.user.id;
  const order = await getOngoingOrder(id, userId);
  let payment = null
  if (order) {
    payment = await getPaymentByOrder(order.id)
    if (payment && payment.status === "PENDING") {
      await checkPaymentStatus(payment.invoiceNumber!)
    }
  }

  const participant =  await getParticipantByEventUser(id, userId)
  const group = order?.groupId ? await getGroupById(order.groupId) : undefined

  return (
    <div>
      <div className="mx-auto max-w-lg space-y-2">

        {payment && (
          <>
            <EventPaymentCard payment={payment} />
            {payment.status === "PENDING" && payment.paymentURL && (
              <Button asChild className="w-full">
                <Link href={payment.paymentURL}>
                  Complete payment
                </Link>
              </Button>
            )}
          </>
        )}

        {participant && (
          <>
            <Item size="sm" variant="outline">
              <ItemMedia variant="icon">
                <TicketCheck/>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Registrations</ItemTitle>
                {participant.bibNumber && (
                  <ItemDescription>
                    {formatBibNumber(participant.bibNumber)}
                  </ItemDescription>
                )}
              </ItemContent>

              <ItemContent className="flex-none text-center py-1">
                <ItemDescription>
                <span className="uppercase inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {participant?.status}
                </span>
                </ItemDescription>
              </ItemContent>
            </Item>

            {group && (
              <>
                <GroupItem group={group} />
                <InviteItem eventId={event.id} group={group}  />
              </>
            )}
          </>
        )}

        <EventCard event={event} participant={participant} />



        {event.locationLink && (
          <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="px-4 py-5 sm:px-6">

              <div className="flex">
                <div className="mr-4 shrink-0 ">
                  <div className="size-8 [&_svg:not([class*='size-'])]:size-4 border rounded-sm bg-muted flex items-center justify-center">
                    <MapPin />
                  </div>

                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Locations</h3>
                </div>
              </div>

            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="w-full overflow-hidden">
                <iframe
                  src={event.locationLink}
                  width="470" height="450" style={{border: 0}} allowFullScreen={false} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        )}



      </div>

    </div>
  )
}