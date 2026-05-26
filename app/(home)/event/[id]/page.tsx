import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import * as React from "react";
import {Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {Item, ItemContent, ItemDescription} from "@/components/ui/item";
import {Badge} from "@/components/ui/badge";
import {getOnGoingParticipant} from "@/db/query/participant-query";
import {EventDate} from "@/components/events/event-date";
import {getGroupById} from "@/db/query/event-group.query";
import {getPaymentByParticipant} from "@/db/query/event-payment.query";
import {formatBibNumber} from "@/utils/money-helper";
import {CheckCircleIcon, RouteIcon, Shirt, Tickets} from "lucide-react";
import {getCategoryById} from "@/db/query/event-category.query";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {InviteItem} from "@/app/(home)/event/[id]/invite-item";
import {EventCard} from "@/components/events/event-card";

export default async function Page({params}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);

  if (!event) {
    redirect('/');
  }

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    return (
      <div className="bg-slate-50 pt-18 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 pt-10 pb-24">
          <EventCard event={event} hasFooter={true} />
        </div>
      </div>
    )
  }

  const participant = await getOnGoingParticipant(id, session.user.id);
  let payment, group, category = undefined
  if (participant) {
    [payment, group, category] = await Promise.all([
      getPaymentByParticipant(participant.id),
      getGroupById(participant.groupId!),
      getCategoryById(participant.categoryId!),
    ]);
  }

  return (
    <div className="bg-slate-50 pt-18">
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 pt-10 pb-24">
        <div className="space-y-4">

          <EventCard event={event} hasFooter={false} />

          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
              {participant ? (
                <CardAction>
                  <Badge variant="secondary" className="uppercase">{participant.status}</Badge>
                </CardAction>
              ) : null}
            </CardHeader>
            <CardContent>

              {participant ? (
                <>
                  {participant.status != PARTICIPANT_STATUS.COMPLETED ? (
                    <div>
                      <Link href={`/event/${id}/register`}
                            className={`${buttonVariants({variant: "default", size: "lg"})} w-full uppercase`}>
                        Continue Registrations
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                          <div className="shrink-0">
                            <CheckCircleIcon aria-hidden="true" className="size-5 text-green-400"/>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">Registration confirmed.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <Link href={`/event/${id}/register`}
                        className={`${buttonVariants({variant: "default", size: "lg"})} w-full uppercase`}>
                    Register now
                  </Link>
                </div>
              )}

            </CardContent>
          </Card>

          {participant && participant.status === PARTICIPANT_STATUS.COMPLETED && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Participant</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
                    <Item variant="muted" className="flex-col items-stretch">
                      <ItemContent className="gap-1">
                        <ItemDescription
                          className="text-xs font-medium tracking-wider text-muted-foreground uppercase flex items-center gap-2.5">
                          <Tickets className="h-4 w-4 text-muted-foreground"/>
                          BIB NUMBER
                        </ItemDescription>
                        <span className="cn-font-heading text-lg font-semibold">
                      {participant?.bibNumber ? formatBibNumber(participant?.bibNumber) : "-"}
                    </span>
                      </ItemContent>
                    </Item>
                    <Item variant="muted" className="flex-col items-stretch">
                      <ItemContent className="gap-1">
                        <ItemDescription
                          className="text-xs font-medium tracking-wider text-muted-foreground uppercase flex items-center gap-2.5">
                          <Shirt className="h-4 w-4 text-muted-foreground"/>
                          Jersey Size
                        </ItemDescription>
                        <span className="cn-font-heading text-lg font-semibold uppercase">
                      {participant?.jerseySize}
                    </span>
                      </ItemContent>
                    </Item>
                    <Item variant="muted" className="flex-col items-stretch">
                      <ItemContent className="gap-1">
                        <ItemDescription
                          className="text-xs font-medium tracking-wider text-muted-foreground uppercase flex items-center gap-2.5">
                          <RouteIcon className="h-4 w-4 text-muted-foreground"/>
                          Category
                        </ItemDescription>
                        <span className="cn-font-heading text-lg font-semibold uppercase">
                      {category?.name}
                    </span>
                      </ItemContent>
                    </Item>
                  </div>
                  {payment && (
                    <Item variant="muted" className="mt-3">
                      <ItemContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-muted-foreground">
                              Invoice paid on <EventDate eventDate={payment.updatedAt} type="date"/>
                            </span>
                            <span className="text-lg font-semibold tabular-nums">
                              {payment.invoiceNumber}
                            </span>
                          </div>
                        </div>

                      </ItemContent>
                    </Item>
                  )}
                </CardContent>
              </Card>

              {group && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Group Name: {group.name}
                    </CardTitle>
                    <CardAction>
                      {group.participants.length}/5 members
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col space-y-4">
                      {group.participants.map((participant) => (
                        <li className="inline-flex items-center gap-2" key={participant.id}>
                          <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png"/>
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="font-bold">{participant.user.name}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  {category && (
                    <CardFooter>
                      <InviteItem eventId={id} categoryId={category.id} groupId={group.id} groupName={group.name}/>
                    </CardFooter>
                  )}
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
