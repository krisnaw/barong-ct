'use server'

import {db} from "@/db/db";
import {sql} from "drizzle-orm";
import {participant} from "@/db/schema";
import {formatEventDate, formatEventTime} from "@/types/date-helper";
import EventJoinedEmail from "@/react-email-starter/emails/event-joined-email";
import {Resend} from "resend";
import {getUserById} from "@/db/query/user-query";
import {getEventById} from "@/db/query/event-query";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createParticipant(eventId: number, userId: string) {
  await db.insert(participant).values({
    userId,
    eventId,
    status: 'confirmed',
    bibNumber: sql`(SELECT COALESCE(MAX(${participant.bibNumber}), 0) + 1
                    FROM ${participant}
                    WHERE ${participant.eventId} = 1)`,
  });

  // send email confirmation

  const user = await getUserById(userId)
  const event = await getEventById(eventId)

  if (user && event) {
    const eventURL = `${process.env.BETTER_AUTH_URL}/event/${eventId}`
    const param = {
      name: user.name,
      eventName : event.name ?? "There",
      eventDate : formatEventDate(event.startDate),
      eventTime : formatEventTime(event.startDate),
      meetingPoint : event.locationName ?? "",
      eventURL
    }

    await resend.emails.send({
      from: 'Barong Cycling Team <info@barongmelali.com>',
      to: [user.email],
      subject: `Thanks for joining : ${event.name}`,
      react: EventJoinedEmail(param)
    })
  }


}