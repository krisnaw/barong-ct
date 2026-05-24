'use server'

import {db} from "@/db/db";
import {and, eq, sql} from "drizzle-orm";
import {EventType, participant, UserType} from "@/db/schema";
import {formatEventDate, formatEventTime} from "@/types/date-helper";
import EventJoinedEmail from "@/react-email-starter/emails/event-joined-email";
import {Resend} from "resend";
import {getUserById} from "@/db/query/user-query";
import {getEventById} from "@/db/query/event-query";
import {getParticipantByEventUser} from "@/db/query/participant-query";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function markParticipantComplete(eventId: number, userId: string) {
  await db.update(participant).set({
    status: PARTICIPANT_STATUS.COMPLETED,
    bibNumber: sql`(SELECT COALESCE(MAX(${participant.bibNumber}), 0) + 1
                    FROM ${participant}
                    WHERE ${participant.eventId} = 1)`,
  }).where(and(eq(participant.userId, userId), eq(participant.eventId, eventId)))

  // Mark Participant As Complete
  const user = await getUserById(userId)
  const event = await getEventById(eventId)
  if (user && event) {
    await sendEmailConfirmation(event, user)
  }
}

async function sendEmailConfirmation(event : EventType, user: UserType) {
  const eventURL = `${process.env.BETTER_AUTH_URL}/event/${event.id}`
  const participant = await getParticipantByEventUser(event.id, user.id)
  const param = {
    name: user.name,
    eventName : event.name ?? "There",
    eventDate : formatEventDate(event.startDate),
    eventTime : formatEventTime(event.startDate),
    meetingPoint : event.locationName ?? "",
    eventURL,
    bibNumber: participant?.bibNumber ?? undefined,
    jerseySize: participant?.jerseySize ?? undefined,
  }

  await resend.emails.send({
    from: 'Barong Cycling Team <info@barongmelali.com>',
    to: [user.email],
    subject: `Thanks for joining : ${event.name}`,
    react: EventJoinedEmail(param)
  })
}