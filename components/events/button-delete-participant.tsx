'use client'

import {DeleteEventParticipantAction} from "@/app/actions/event-participant/event-participant.action";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";

export function ButtonDeleteParticipant({participantId}: {participantId: number}) {
  return (
    <form action={DeleteEventParticipantAction}>
      <input type="hidden" value={participantId} name="participantId" />
      <Button variant="destructive" size="sm" type="submit">
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  )
}