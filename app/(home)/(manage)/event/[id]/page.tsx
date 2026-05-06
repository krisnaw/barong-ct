import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getPaymentByOrder} from "@/db/query/event-payment.query";
import {getParticipantByEventUser} from "@/db/query/participant-query";
import * as React from "react";
import {formatBibNumber} from "@/utils/money-helper";
import {checkPaymentStatus} from "@/app/actions/payment/payment-status.action";
import {getGroupById} from "@/db/query/event-group.query";
import {InviteItem} from "@/app/(home)/(manage)/event/[id]/invite-item";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {EventCard} from "@/components/events/event-card";
import {Item, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item";

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

  const participant = await getParticipantByEventUser(id, userId)
  const group = order?.groupId ? await getGroupById(order.groupId) : undefined

  return (
    <div>

      <div className="mx-auto max-w-xl px-4 md:px-6 lg:px-8 mt-8 space-y-6">

        <Card className="pt-0">
          <CardHeader className="bg-muted/50 border-b p-4 items-center">
            <CardTitle className="font-bold leading-7">
              Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">

              <Item className="bg-green-50 col-span-2 inset-ring inset-ring-green-600/20">
                <ItemContent>
                  <ItemTitle
                    className="uppercase cn-card-title cn-font-heading text-xl tabular-nums  text-green-700 text-center">
                    Registration Confirmed
                  </ItemTitle>
                </ItemContent>
              </Item>


              {participant && (
                <Item className="bg-muted">
                  <ItemContent>
                    <ItemDescription>Bib Number</ItemDescription>
                    <ItemTitle className="cn-card-title cn-font-heading text-2xl tabular-nums text-primary">
                      {participant.bibNumber && formatBibNumber(participant.bibNumber)}
                    </ItemTitle>
                  </ItemContent>
                </Item>
              )}


              {participant && (
                <Item className="bg-muted">
                  <ItemContent>
                    <ItemDescription>Jersey Size</ItemDescription>
                    <ItemTitle className="cn-card-title cn-font-heading text-2xl tabular-nums text-primary">
                      M
                    </ItemTitle>
                  </ItemContent>
                </Item>
              )}

              {payment && (
                <Item className="bg-muted col-span-2">
                  <ItemContent>
                    <ItemDescription>
                      Payment Success
                    </ItemDescription>
                    <ItemTitle className="cn-card-title cn-font-heading text-2xl tabular-nums text-primary">
                      {payment.invoiceNumber}
                    </ItemTitle>
                  </ItemContent>
                </Item>
              )}

            </div>
          </CardContent>
        </Card>

        <EventCard event={event} withFooter={false} participant={participant}/>

        {group && (
          <Card className="pt-0">
            <CardHeader className="bg-muted/50 border-b p-4 items-center">
              <CardTitle className="font-bold leading-7">
                Group: {group.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {group.participants.length}/5 members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col space-y-4">
                {group.participants.map((name: string, index: number) => (
                  <li className="inline-flex items-center gap-2" key={index}>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png"/>
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="font-bold">{name}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <InviteItem eventId={event.id} group={group}/>
            </CardFooter>
          </Card>
        )}

        {event.locationLink && (
          <Card>
            <CardHeader>
              <CardTitle>
                Texas Tech University -Costa Rica
              </CardTitle>
              <CardDescription>
                Avenida Escazú, Edificio AE205, San José Province, Escazu, 10201, Costa Rica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-hidden">
                <iframe
                  src={event.locationLink}
                  width="470" height="450" style={{border: 0}} allowFullScreen={false} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}