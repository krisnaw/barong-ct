import {getParticipantByEvent} from "@/db/query/participant-query";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {emptyBanner} from "@/types/date-helper";
import {EventDate} from "@/components/events/event-date";
import {MapPin} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const event = await getEventById(id)
  if (!event) {
    redirect('/dashboard/events');
  }
  const participants = await getParticipantByEvent(id)
  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold">Event Detail</h1>
        <div className="mt-4">
          <div className="flex outline rounded-xl p-4">

            <div className="mr-4 shrink-0">
              <img
                alt=""
                src={event.feature_image ?? emptyBanner}
                className="inline-block size-24 object-cover rounded-md outline -outline-offset-1 outline-white/10"
              />
            </div>

            <div className="w-full flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div>
                <p className="text-gray-500 text-lg">
                  <EventDate eventDate={event.startDate} type="date" />
                </p>
                <h4 className="text-lg font-bold ">
                  {event.name}
                </h4>
                <p className="mt-1 inline-flex items-center text-gray-500 gap-2">
                  <MapPin size={18} /> {event.locationName}
                </p>
              </div>
              <div className="shrink-0 flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/events/${event.id}/edit`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Participants</h1>
        <div className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.length > 0 ? (
                  participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">{participant.user.name ?? "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="font-medium">Sorry, no participant yet</TableCell>
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