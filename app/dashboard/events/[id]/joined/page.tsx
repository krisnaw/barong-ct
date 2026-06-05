import {getParticipantsByEventId} from "@/db/query/participant-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {EventDate} from "@/components/events/event-date";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const participants = await getParticipantsByEventId(id)

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
              <TableHead className="text-right">CreatedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{participant.user.name}</TableCell>
                <TableCell>{participant.user.email}</TableCell>
                <TableCell>{participant.status}</TableCell>
                <TableCell className="text-right">
                  <EventDate eventDate={participant.createdAt} type="date" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}