import {getParticipantByEvent} from "@/db/query/participant-query";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CalendarIcon, MapPin, Users} from "lucide-react";
import {EventDate} from "@/components/events/event-date";
import Link from "next/link";
import {format} from "date-fns";
import {id as idLocale} from "date-fns/locale";
import {BtnResendConfirm} from "@/app/dashboard/events/[id]/btn-resend-confirm";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const event = await getEventById(id)
  if (!event) {
    redirect('/dashboard/events');
  }

  const participants = await getParticipantByEvent(id)

  return (
    <div className="flex flex-col gap-6">

      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold  sm:truncate sm:text-3xl sm:tracking-tight">
            {event.name}
          </h2>

          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-400">
              <MapPin aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-gray-500" />
              {event.locationName}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-400">
              <Users aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-gray-500" />
              Max: {event.maxParticipants}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-400">
              <CalendarIcon aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-gray-500" />
              <EventDate eventDate={event.startDate} type="date"/> - <EventDate eventDate={event.startDate} type="time"/>
            </div>
          </div>

        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button variant="outline">
            <Link href={`/dashboard/events/${id}`}>
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Total participants</CardDescription>
            <CardTitle className="text-3xl">
              {participants.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>


      <div>
        <h1 className="text-2xl font-bold">Participants</h1>
        <div className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.length > 0 ? (
                  participants.map((participant) => (
                    <TableRow key={participant.participant.id}>
                      <TableCell className="font-medium">{participant.user.name}</TableCell>
                      <TableCell className="font-medium">{participant.user.email}</TableCell>
                      <TableCell className="font-medium">{format(participant.participant.createdAt, 'PPpp', { locale: idLocale })}</TableCell>
                      <TableCell>
                        <BtnResendConfirm eventId={event.id} name={participant.user.name} userId={participant.user.id} email={participant.user.email} />
                        {/*<ButtonDeleteParticipant participantId={participant.id} />*/}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="font-medium" colSpan={2}>Sorry, no participant yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>


    </div>
  )
}