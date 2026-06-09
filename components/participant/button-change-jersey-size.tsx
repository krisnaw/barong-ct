"use client"

import {useState, useTransition} from "react";
import {ShirtIcon} from "lucide-react";
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
import {updateParticipant} from "@/app/actions/event-participant/event-participant.action";
import {sizes} from "@/components/checkout/select-jersey-field";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export function ButtonChangeJerseySize({ participantId, currentSize }: { participantId: number; currentSize?: string | null }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(currentSize?.toLowerCase() ?? sizes[3].id)

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleConfirm() {
    startTransition(async () => {
      const res = await updateParticipant({ id: participantId, jerseySize: selected })
      if (res.success) {
        toast.success("Jersey size updated.")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <Button variant="outline" size="icon-xs">
          <ShirtIcon />
        </Button>
      } />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Jersey Size</AlertDialogTitle>
          <AlertDialogDescription>
            Select the new jersey size for this participant.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelected(size.id)}
              className={`rounded-xl border py-3 text-sm font-semibold uppercase transition-colors ${
                selected === size.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}