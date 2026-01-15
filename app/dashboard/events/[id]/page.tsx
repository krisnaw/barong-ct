import {getParticipantByEvent} from "@/db/query/participant-query";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";

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
        <div>
          {event.name}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Participants</h1>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.user.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>


    </div>
  )
}