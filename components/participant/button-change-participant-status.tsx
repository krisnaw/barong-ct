"use client"

import {useState, useTransition} from "react";
import {PencilIcon} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {toast} from "sonner";
import {updateParticipantStatus} from "@/app/actions/event-participant/event-participant.action";
import {UpdateParticipantType} from "@/db/schema";
import {PARTICIPANT_STATUS_LABELS, ParticipantStatus} from "@/utils/participant-status";

export function ButtonChangeParticipantStatus({ participantId, currentStatus }: { participantId: number, currentStatus?: string }) {
  const [selected, setSelected] = useState<ParticipantStatus>(
    (currentStatus as ParticipantStatus) ?? PARTICIPANT_STATUS.DRAFT
  )
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const payload : UpdateParticipantType = {
        id: participantId,
        status: PARTICIPANT_STATUS.COMPLETED
      }
      const res = await updateParticipantStatus(payload)
      if (res?.success === false) {
        toast.error(res.message)
      } else {
        toast.success("Event status updated.")
        setOpen(false)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <Button variant="outline" size="sm">
          <PencilIcon />
          Change status
        </Button>
      } />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Participant Status</AlertDialogTitle>
          <AlertDialogDescription>
            Select the new status for this participant.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Select
          defaultValue={currentStatus}
          value={selected}
          onValueChange={(v) => setSelected(v as ParticipantStatus)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(PARTICIPANT_STATUS) as [string, ParticipantStatus][]).map(([, value]) => (
              <SelectItem key={value} value={value}>
                {PARTICIPANT_STATUS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AlertDialogFooter>

          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Saving…" : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
