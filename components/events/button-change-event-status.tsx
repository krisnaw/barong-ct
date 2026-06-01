"use client"

import {useState, useTransition} from "react"
import {toast} from "sonner"
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {EVENT_STATUS} from "@/utils/event.helper"
import {UpdateEventAction} from "@/app/actions/event/event.action"

type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS]

export function ButtonChangeEventStatus({ currentStatus, eventId }: { currentStatus?: string; eventId: number }) {
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<EventStatus>(
    (currentStatus as EventStatus) ?? EVENT_STATUS.DRAFT
  )
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const res = await UpdateEventAction({ id: eventId, status: selectedStatus })
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
      <AlertDialogTrigger render={<Button variant="outline" size="sm">Change Status</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Event Status</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new status for this event.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Select items={EVENT_STATUS} value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as EventStatus)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" className="capitalize" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EVENT_STATUS).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
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