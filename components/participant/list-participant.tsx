import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {EventDate} from "@/components/events/event-date";
import {formatMoney} from "@/utils/money-helper";
import {Badge} from "@/components/ui/badge";
import {ParticipantType} from "@/db/query/participant-query";
import {BtnResendConfirm} from "@/components/button/btn-resend-confirm";

export function ListParticipant({participants} : {participants : ParticipantType[]}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bib</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Group</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Promo</TableHead>
          <TableHead>Cat</TableHead>
          <TableHead>Registered At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.length > 0 ? (
          participants.map((participant: ParticipantType) => (
            <TableRow key={participant.id}>
              <TableCell className="font-medium">{participant.bibNumber ?? "-"}</TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="font-medium">{participant.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {participant.user.email}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <Badge variant="secondary">
                  {participant.group?.name}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {participant.finalPrice ? formatMoney(participant.finalPrice) : "-"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {participant.payments[0].invoiceNumber}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {participant.promoCode ?? "-"}
              </TableCell>
              <TableCell className="font-medium">
                <Badge>{participant.category?.name}</Badge>
              </TableCell>
              <TableCell className="font-medium">
                <EventDate eventDate={participant.updatedAt} type="date" />
              </TableCell>
              <TableCell>
                <BtnResendConfirm participantId={participant.id} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="font-medium" colSpan={4}>Sorry, no participant yet</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}