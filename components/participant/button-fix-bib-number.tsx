"use client"

import {useState, useTransition} from "react"
import {HashIcon} from "lucide-react"
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
import {toast} from "sonner"
import {fixParticipantBibNumber} from "@/app/actions/event-participant/event-participant.action"

export function ButtonFixBibNumber({participantId, currentBib}: { participantId: number, currentBib: string | null }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const res = await fixParticipantBibNumber(participantId)
      if (res.success) {
        toast.success(res.message)
        setOpen(false)
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <Button variant="outline" size="icon-xs" aria-label="Fix bib number">
          <HashIcon />
        </Button>
      } />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Fix Bib Number</AlertDialogTitle>
          <AlertDialogDescription>
            This will regenerate the bib number based on the current gender in the participant&apos;s profile.
            {currentBib && <> Current bib: <strong>{currentBib}</strong>.</>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Fixing…" : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
