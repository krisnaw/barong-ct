import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarClock, CalendarIcon, MapPin} from "lucide-react";
import {EventDate} from "@/components/events/event-date";
import Link from "next/link";
import {ButtonDownloadParticipant} from "@/components/button/button-download-participant";
import {getParticipantByEvent} from "@/db/query/participant-query";
import {ListParticipant} from "@/components/participant/list-participant";
import type {CompletedParticipantTableRow} from "@/components/participant/list-participant";
import {buttonVariants} from "@/components/ui/button";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const {id} = await params;

  const event = await getEventById(id)

  if (!event) {
    redirect('/dashboard/events');
  }

  const participants = await getParticipantByEvent(id)
  const participantRows: CompletedParticipantTableRow[] = participants.map((participant) => ({
    id: participant.id,
    eventId: participant.eventId,
    bibNumber: participant.bibNumber,
    name: participant.user.name,
    email: participant.user.email,
    groupName: participant.group?.name ?? null,
    finalPrice: participant.finalPrice,
    invoiceNumber: participant.payments[0]?.invoiceNumber ?? null,
    promoCode: participant.promoCode,
    categoryName: participant.category?.name ?? null,
    registeredAt: participant.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {event.name}
          </CardTitle>
          <CardDescription>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <MapPin aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-muted-foreground"/>
                {event.locationName}
              </div>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <CalendarIcon aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-muted-foreground"/>
                <EventDate eventDate={event.startDate} type="date"/> - <EventDate eventDate={event.startDate} type="time"/>
              </div>
              {event.registrationClosesAt && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <CalendarClock aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-muted-foreground"/>
                  Registration closes&nbsp;
                  <EventDate eventDate={event.registrationClosesAt} type="date"/>
                </div>
              )}
            </div>
          </CardDescription>
          <CardAction className="inline-flex gap-2">
            <Link
              className={buttonVariants({variant: "outline", size: "sm"})}
              href={`/dashboard/events/${id}/register`}
            >
              Register User
            </Link>
            <Link
              className={buttonVariants({variant: "ghost", size: "sm"})}
              href={`/dashboard/events/${id}/promo`}>
              Promo
            </Link>
            <Link
              className={buttonVariants({variant: "ghost", size: "sm"})}
              href={`/dashboard/events/${id}/category`}>
              Category
            </Link>
            <Link
              className={buttonVariants({variant: "ghost", size: "sm"})}
              href={`/dashboard/events/${id}/groups`}>
              Manage Groups
            </Link>
            <Link
              className={buttonVariants({variant: "ghost", size: "sm"})}
              href={`/dashboard/events/${id}/edit`}>
              Edit
            </Link>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardAction className="flex gap-2">
            <ButtonDownloadParticipant eventId={event.id} eventName={event.name}/>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <ListParticipant participants={participantRows}/>
        </CardContent>
      </Card>
    </div>
  )
}
