'use client'

import {useState} from "react"
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
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"
import {Trash} from "lucide-react"
import {toast} from "sonner"
import {deleteParticipantAction} from "@/app/actions/event-participant/event-participant.action"
import {getPendingParticipantByEvent} from "@/db/query/participant-query"

type PendingParticipant = Awaited<ReturnType<typeof getPendingParticipantByEvent>>[number]

export function DeleteParticipant({participant}: {participant: PendingParticipant}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onConfirm = async () => {
    setLoading(true)
    const res = await deleteParticipantAction(participant.id)
    setLoading(false)
    if (res.success) {
      toast.success(res.message)
      setOpen(false)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="destructive" size="icon"><Trash /></Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete participant?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove <strong>{participant.user.name}</strong> from this event.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={loading} onClick={onConfirm}>
            {loading ? "Deleting…" : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}