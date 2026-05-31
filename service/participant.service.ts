'use server'

import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {EventType, participant, UserType} from "@/db/schema";
import {formatEventDate, formatEventTime} from "@/types/date-helper";
import {Resend} from "resend";
import {getUserWithDetail} from "@/db/query/user-query";
import {getEventById} from "@/db/query/event-query";
import {getParticipantByEventUser} from "@/db/query/participant-query";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {generateBibNumber} from "@/utils/bib.helper";
import {UserWithDetail} from "@/types/auth-types";
import EventJoinedEmailAlt from "@/react-email-starter/emails/event-joined-email-alt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function markParticipantComplete(eventId: number, userId: string) {
  const user = await getUserWithDetail(userId)
  const bibNumber = await generateBibNumber(user.detail.gender as "male" | "female", eventId,);
  await db.update(participant).set({
    status: PARTICIPANT_STATUS.COMPLETED,
    bibNumber: bibNumber,
  }).where(and(eq(participant.userId, userId), eq(participant.eventId, eventId)))

  // Mark Participant As Complete
  const event = await getEventById(eventId)
  if (user && event) {
    await sendEmailConfirmation(event, user)
  }
}

export async function sendEmailConfirmation(event : EventType, user: UserType | UserWithDetail) {
  const eventURL = `${process.env.BETTER_AUTH_URL}/event/${event.id}`
  const participant = await getParticipantByEventUser(event.id, user.id)

  const url = new URL(eventURL + "/register/group");
  url.searchParams.append('groupId', String(participant?.groupId));
  url.searchParams.append('category', String(participant?.categoryId));
  url.searchParams.append('group', participant?.group?.name ?? "");
  const inviteURL = url.toString();

  const param = {
    name: user.name,
    eventName : event.name ?? "There",
    eventDate : formatEventDate(event.startDate),
    eventTime : formatEventTime(event.startDate),
    meetingPoint : event.locationName ?? "",
    eventURL,
    bibNumber: participant?.bibNumber ?? undefined,
    jerseySize: participant?.jerseySize ?? undefined,
    category: participant?.category?.name ?? undefined,
    inviteURL
  }

  await resend.emails.send({
    from: 'Barong Cycling Team <info@barongmelali.com>',
    to: [user.email],
    subject: `Thanks for joining : ${event.name}`,
    react: EventJoinedEmailAlt(param)
  })
}