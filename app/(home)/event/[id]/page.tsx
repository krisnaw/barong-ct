import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import * as React from "react";
import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {Badge} from "@/components/ui/badge";
import {getOnGoingParticipant} from "@/db/query/participant-query";
import {getGroupById} from "@/db/query/event-group.query";
import {getPaymentByParticipant} from "@/db/query/event-payment.query";
import {CheckCircleIcon} from "lucide-react";
import {EventCard} from "@/components/events/event-card";
import {EventDetailAlt} from "@/components/events/event-detail-alt";
import {SignupForm} from "@/components/signup-form";
import {RegistrationCompleteAlt} from "@/components/events/registration-complete-alt";

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
  let payment, group = undefined
  if (participant) {
    [payment, group] = await Promise.all([
      getPaymentByParticipant(participant.id),
      getGroupById(participant.groupId!),
    ]);
  }

  return (
    <div className="bg-slate-50 pt-18">
      <div className="mx-auto max-w-xl px-4 md:px-6 lg:px-8 pt-10 pb-24">
        <div className="space-y-4">
          <EventDetailAlt event={event}>
            <div className="flex flex-col text-left">
              <div className="text-left font-semibold w-full mb-2 text-muted-foreground">
                Create an account to register for this event
              </div>
              <SignupForm returnURL={`/event/${event.id}`}/>
            </div>
          </EventDetailAlt>

          {participant && participant.status === PARTICIPANT_STATUS.COMPLETED && (
            <RegistrationCompleteAlt eventId={id} isGroupRide={event.isGroupRide} group={group} participant={participant} payment={payment} />
          )}


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
        </div>
      </div>
    </div>
  )
}
