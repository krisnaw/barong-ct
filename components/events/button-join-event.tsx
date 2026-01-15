'use client'

import {Button} from "@/components/ui/button";
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {Spinner} from "@/components/ui/spinner";
import {joinEventAction} from "@/app/actions/event-participant/event-participant.action";
import {toast} from "sonner";

export function ButtonJoinEvent({eventId} : {eventId: number}) {
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (_: ActionResponse, formData: FormData) => {
    const payload = {
      eventId: formData.get('eventId') as string
    }
    const res = await joinEventAction(payload)
    toast.info(res.message)
    return res;
  }, initialState)

  return (
    <form action={formAction} className="inline-flex w-full">
      <input type="hidden" name="eventId" defaultValue={eventId} />
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? <Spinner /> : null}
        Join
      </Button>
    </form>
  )
}