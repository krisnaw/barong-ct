import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import * as React from "react";
import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {Badge} from "@/components/ui/badge";
import {getOnGoingParticipant} from "@/db/query/participant-query";
import {EventDate} from "@/components/events/event-date";
import {getGroupById} from "@/db/query/event-group.query";
import {getPaymentByParticipant} from "@/db/query/event-payment.query";
import {CheckCircle2Icon, CheckCircleIcon, CircleUser, Link2, RouteIcon, Shirt, Ticket, Users} from "lucide-react";
import {getCategoryById} from "@/db/query/event-category.query";
import {InviteItem} from "@/app/(home)/event/[id]/invite-item";
import {EventCard} from "@/components/events/event-card";
import {Alert, AlertAction, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Separator} from "@/components/ui/separator";
import {EventQr} from "@/components/events/event-qr";

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
          <EventCard event={event} noSession={true}/>
        </div>
      </div>
    )
  }

  //TODO: refactor to include with relation
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
          <EventCard event={event}/>
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
            <div className="space-y-6">
              <Card>
                <CardContent>

                  <div className="space-y-3">
                    {payment && (
                      <Alert className="bg-green-50 text-green-600 border border-green-600/20">
                        <CheckCircle2Icon/>
                        <AlertTitle>Payment successful</AlertTitle>
                        <AlertDescription>
                          Invoice paid on <EventDate eventDate={payment.updatedAt} type="date"/>
                        </AlertDescription>
                        <AlertAction className="font-semibold leading-snug">
                          {payment.invoiceNumber}
                        </AlertAction>
                      </Alert>
                    )}

                    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
                      <Item className="flex-col items-stretch bg-blue-50 text-blue-700 border border-blue-700/10">
                        <ItemContent className="gap-1">
                          <ItemDescription
                            className="text-xs font-medium tracking-wider text-muted-foreground uppercase flex items-center gap-2.5">
                            <Ticket className="h-4 w-4 text-muted-foreground"/>
                            BIB NUMBER
                          </ItemDescription>
                          <span className="cn-font-heading text-lg font-semibold">
                          {participant?.bibNumber ? participant?.bibNumber : "-"}
                        </span>
                        </ItemContent>
                      </Item>
                      <Item className="flex-col items-stretch bg-blue-50 text-blue-700 border border-blue-700/10">
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
                      <Item className="flex-col items-stretch bg-blue-50 text-blue-700 border border-blue-700/10">
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
                    {group && (
                      <Item>
                        <ItemContent>

                          <ItemDescription className="text-xs font-medium tracking-wider text-muted-foreground uppercase ">
                          <span className="flex items-center justify-between">
                            <span className="flex items-center gap-2.5">
                              <Users className="h-4 w-4 text-muted-foreground"/>
                              Group Ride: {group.name}
                            </span>
                            <span>
                              {group.participants.length}/{event.isGroupRide} Members
                            </span>
                          </span>
                          </ItemDescription>

                          <Separator className="my-2"/>

                          <div className="min-h-24 space-y-2">
                            {group.participants.map((participant) => (
                              <Item size="sm" variant="outline" key={participant.id}>
                                <ItemMedia variant="icon">
                                  <CircleUser className="h-4 w-4 text-muted-foreground"/>
                                </ItemMedia>
                                <ItemContent className="flex-row items-center gap-3">
                                  <ItemTitle className="shrink-0">{participant.user.name}</ItemTitle>
                                </ItemContent>
                                <ItemActions>
                                  <div className="uppercase">
                                    {participant.jerseySize}
                                  </div>
                                  <Badge variant="outline">
                                    {participant.bibNumber ? participant.bibNumber : "-"}
                                  </Badge>
                                </ItemActions>
                              </Item>
                            ))}
                          </div>

                          {event.isGroupRide && (
                            <>
                              {group.participants.length < event.isGroupRide ? (
                                <>
                                  {category && (
                                    <div>
                                      <ItemDescription
                                        className="text-xs font-medium tracking-wider text-muted-foreground uppercase flex items-center gap-2.5">
                                        <Link2 className="h-4 w-4 text-muted-foreground"/>
                                        Invite Link
                                      </ItemDescription>

                                      <div className="mt-1">
                                        {category && (
                                          <InviteItem eventId={id} categoryId={category.id} groupId={group.id}
                                                      groupName={group.name}/>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : null}
                            </>
                          )}

                        </ItemContent>
                      </Item>
                    )}
                  </div>
                </CardContent>
              </Card>
              <EventQr participant={participant} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
