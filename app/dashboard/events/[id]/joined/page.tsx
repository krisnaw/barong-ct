import {getPendingParticipantByEvent} from "@/db/query/participant-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ListJoinedParticipant} from "@/components/participant/list-joined-participant";
import type {JoinedParticipantTableRow} from "@/components/participant/list-joined-participant";
import {BackButton} from "@/components/button/back-button";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const participants = await getPendingParticipantByEvent(id)
  const participantRows: JoinedParticipantTableRow[] = participants.map((participant) => ({
    id: participant.id,
    name: participant.user.name,
    email: participant.user.email,
    status: participant.status,
    paymentStatus: participant.payments[0]?.status ?? null,
    createdAt: participant.createdAt.toISOString(),
    bibNumber: participant.bibNumber,
  }))

  return (
    <div className="space-y-4">
      <BackButton href={`/dashboard/events/${id}`}>Back to event</BackButton>
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <ListJoinedParticipant participants={participantRows}/>
        </CardContent>
      </Card>
    </div>
  )
}
