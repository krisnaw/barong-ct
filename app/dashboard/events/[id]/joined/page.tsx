import {getParticipantsByEventId} from "@/db/query/participant-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"

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
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{participant.user.name}</TableCell>
                <TableCell>{participant.user.email}</TableCell>
                <TableCell>{participant.status}</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}