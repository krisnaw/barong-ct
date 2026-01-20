'use client'

import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {addParticipant} from "@/app/actions/event-participant/event-participant.action";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";

export function ButtonAddParticipant({eventId, userId, name, email} : {eventId: number, userId: string, name: string, email: string}) {
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (_: ActionResponse, formData: FormData) => {
    const payload = {
      eventId: formData.get('eventId') as string,
      userId: formData.get('userId') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    }
    const res = await addParticipant(payload)
    toast.info(res.message)
    return res;
  }, initialState)

  return (
    <form action={formAction} className="inline-flex w-full">
      <input type="hidden" name="eventId" defaultValue={eventId} />
      <input type="hidden" name="userId" defaultValue={userId} />
      <input type="hidden" name="name" defaultValue={name} />
      <input type="hidden" name="email" defaultValue={email} />
      <Button size="sm" className="w-full" type="submit" disabled={isPending}>
        {isPending ? <Spinner /> : null}
        Add
      </Button>
    </form>
  )
}