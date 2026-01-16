import {checkParticipantByEvent} from "@/db/query/participant-query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {ButtonJoinEvent} from "@/components/events/button-join-event";
import {Button} from "@/components/ui/button";

export async function EventStatus({eventId}: {eventId: number}) {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) return null;

  const event = await checkParticipantByEvent(eventId, session.user.id)

  if (!event) {
    return (
      <ButtonJoinEvent eventId={eventId}  />
    )
  }

  return (
    <Button className="w-full" type="submit" disabled={true}>
      You have joined this event
    </Button>
  )
}