'use client'

import {Button} from "@/components/ui/button";

export function ButtonAddParticipant({eventId, userId, name, email} : {eventId: number, userId: string, name: string, email: string}) {
  return (
    <form  className="inline-flex w-full">
      <input type="hidden" name="eventId" defaultValue={eventId} />
      <input type="hidden" name="userId" defaultValue={userId} />
      <input type="hidden" name="name" defaultValue={name} />
      <input type="hidden" name="email" defaultValue={email} />
      <Button size="sm" className="w-full" type="submit">
        Add
      </Button>
    </form>
  )
}