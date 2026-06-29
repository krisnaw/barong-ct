"use client"

import {useState, useTransition} from "react";
import {Users} from "lucide-react";
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
import {EventGroupType} from "@/db/schema";
import {toast} from "sonner";
import {updateParticipant} from "@/app/actions/event-participant/event-participant.action";
import {useRouter} from "next/navigation";

type Props = {
  participantId: number
  currentGroupId?: number | null
  groups: EventGroupType[]
}

export function ButtonChangeParticipantGroup({participantId, currentGroupId, groups}: Props) {
  const [selected, setSelected] = useState<string>(
    currentGroupId ? String(currentGroupId) : ''
  )
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleConfirm() {
    if (!selected) return
    startTransition(async () => {
      const res = await updateParticipant({
        id: participantId,
        groupId: Number(selected),
      })
      if (res?.success === false) {
        toast.error(res.message)
      } else {
        toast.success("Group updated.")
        setOpen(false)
        router.refresh();
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <Button variant="outline" size="sm">
          <Users/>
          Change group
        </Button>
      }/>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Group</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new group for this participant.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Select value={selected} onValueChange={v => setSelected(v ?? '')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select group">
              {groups.find(g => String(g.id) === selected)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {groups.map(g => (
              <SelectItem key={g.id} value={String(g.id)}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending || !selected}
          >
            {isPending ? "Saving…" : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
