import {checkParticipantByEvent} from "@/db/query/participant-query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {ButtonJoinEvent} from "@/components/events/button-join-event";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {userDetail} from "@/db/schema";

export async function EventStatus({eventId, max, current}: {eventId: number, max: number, current: number}) {
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

  // Check if user has name or not

  const event = await checkParticipantByEvent(eventId, session.user.id)
  const detail = await db.query.userDetail.findFirst({
    where: eq(userDetail.userId, session.user.id),
  })

  if (!event) {

    if (!detail) {
      return (
        <div>


          <div className="text-lg font-bold text-gray-600">
            Please complete your profile to join
          </div>
          <Button>
            <Link href="/profile">
              Update profile
            </Link>
          </Button>
        </div>
      )
    }

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