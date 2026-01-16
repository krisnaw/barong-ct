import {checkParticipantByEvent} from "@/db/query/participant-query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {ButtonJoinEvent} from "@/components/events/button-join-event";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export async function EventStatus({eventId}: {eventId: number}) {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    return (
      <Button className="w-full" type="submit">
        <Link href="/auth/signup">
          Please create account or sign in to join
        </Link>
      </Button>
    )
  }

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