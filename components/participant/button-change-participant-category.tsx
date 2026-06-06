"use client"

import {useState, useTransition} from "react"
import {Tag} from "lucide-react"
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {EventCategoryType} from "@/db/schema"
import {toast} from "sonner"
import {updateParticipant} from "@/app/actions/event-participant/event-participant.action"
import {useRouter} from "next/navigation"

type Props = {
  participantId: number
  currentCategoryId?: number | null
  categories: EventCategoryType[]
}

export function ButtonChangeParticipantCategory({participantId, currentCategoryId, categories}: Props) {
  const [selected, setSelected] = useState<string>(
    currentCategoryId ? String(currentCategoryId) : ""
  )
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleConfirm() {
    if (!selected) return
    startTransition(async () => {
      const res = await updateParticipant({
        id: participantId,
        categoryId: Number(selected),
      })
      if (res?.success === false) {
        toast.error(res.message)
      } else {
        toast.success("Category updated.")
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <Button variant="outline" size="icon-xs">
          <Tag />
        </Button>
      } />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Category</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new category for this participant.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Select value={selected} onValueChange={v => setSelected(v ?? "")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category">
              {categories.find(c => String(c.id) === selected)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
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