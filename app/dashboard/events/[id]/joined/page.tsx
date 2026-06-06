import {getPendingParticipantByEvent} from "@/db/query/participant-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {EventDate} from "@/components/events/event-date";
import {ButtonChangeParticipantStatus} from "@/components/participant/button-change-participant-status";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const participants = await getPendingParticipantByEvent(id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead className="text-right">CreatedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{participant.user.name}</TableCell>
                <TableCell>{participant.user.email}</TableCell>
                <TableCell>{participant.status}</TableCell>
                <TableCell>{participant.payments[0]?.status?? "-"}</TableCell>
                <TableCell>  <EventDate eventDate={participant.createdAt} type="date" /></TableCell>
                <TableCell className="text-right">
                  {participant.bibNumber && participant.status !== PARTICIPANT_STATUS.COMPLETED ? (
                    <ButtonChangeParticipantStatus participantId={participant.id} currentStatus={participant.status ?? ""} />
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}