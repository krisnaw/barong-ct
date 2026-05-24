import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import * as React from "react";
import Image from "next/image";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {Item, ItemContent} from "@/components/ui/item";
import {Badge} from "@/components/ui/badge";
import {getOnGoingParticipant} from "@/db/query/participant-query";
import {formatBibNumber} from "@/utils/money-helper";
import {EventDate} from "@/components/events/event-date";
import {getGroupById} from "@/db/query/event-group.query";
import {InviteItem} from "@/app/(home)/event/[id]/invite-item";
import {getPaymentByParticipant} from "@/db/query/event-payment.query";

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
    redirect('/auth/signup')
  }

  const participant = await getOnGoingParticipant(id, session.user.id);
  let payment, group = undefined
  if (participant) {
    [payment, group] = await Promise.all([
      getPaymentByParticipant(participant.id),
      getGroupById(participant.groupId!)
    ]);
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="relative isolate overflow-hidden h-[50vh]">
        <Image
          src={event.feature_image ?? "/empty-banner.png"}
          alt={event.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 pt-10 pb-24">
        <div className="space-y-4">

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
                      Regis Complete
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

          {participant && participant.status == PARTICIPANT_STATUS.COMPLETED && (
            <>
              {participant ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Participant</CardTitle>
                    <CardAction>
                      <Badge
                        className="bg-green-50 text-green-700 uppercase inset-ring inset-ring-green-600/20">{participant.status}</Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent>

                    <Item variant="muted">
                      <ItemContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-muted-foreground">
                              BIB NUMBER
                            </span>
                            <span className="text-lg font-semibold tabular-nums">
                              {formatBibNumber(participant.bibNumber!)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-muted-foreground uppercase">
                              Jersey Size
                            </span>
                            <span className="text-lg font-semibold tabular-nums capitalize">
                              {participant.jerseySize}
                            </span>
                          </div>
                        </div>
                      </ItemContent>
                    </Item>


                  </CardContent>
                </Card>
              ) : null}

              {payment ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment</CardTitle>
                    <CardAction>
                      <Badge className="bg-green-50 text-green-700 uppercase inset-ring inset-ring-green-600/20">{payment.status}</Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <Item variant="muted">
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

                  </CardContent>
                </Card>
              ) : null}

              {group && (
                <Card>
                  {/*<CardHeader>*/}
                  {/*  <CardTitle>*/}
                  {/*    Group Name: {group.name}*/}
                  {/*  </CardTitle>*/}
                  {/*  <CardAction>*/}
                  {/*    {group.participants.length}/5 members*/}
                  {/*  </CardAction>*/}
                  {/*</CardHeader>*/}
                  {/*<CardContent>*/}
                  {/*  <ul className="flex flex-col space-y-4">*/}
                  {/*    {group.participants.map((name: string, index: number) => (*/}
                  {/*      <li className="inline-flex items-center gap-2" key={index}>*/}
                  {/*        <Avatar>*/}
                  {/*          <AvatarImage src="https://github.com/shadcn.png"/>*/}
                  {/*          <AvatarFallback>CN</AvatarFallback>*/}
                  {/*        </Avatar>*/}
                  {/*        <p className="font-bold">{name}</p>*/}
                  {/*      </li>*/}
                  {/*    ))}*/}
                  {/*  </ul>*/}
                  {/*</CardContent>*/}
                  <CardFooter>
                    <InviteItem eventId={event.id} group={group}/>
                  </CardFooter>
                </Card>
              )}
            </>
          )}

          {event.locationLink && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {event.locationName}
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
    </div>
  )
}
