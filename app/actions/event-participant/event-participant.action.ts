'use server'

import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {InsertParticipantType, participant, participantInsertSchema, UpdateParticipantType} from "@/db/schema";
import {Resend} from "resend";
import {getEventById} from "@/db/query/event-query";
import {revalidatePath} from "next/cache";
import {formatEventDate, formatEventTime} from "@/types/date-helper";
import {eq} from "drizzle-orm";
import EventJoinedEmail from "@/react-email-starter/emails/event-joined-email";
import {getParticipantById} from "@/db/query/participant-query";
import {z} from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resendEmailConfirmation(participantId: number): Promise<ActionResponse> {

  const participant = await getParticipantById(participantId)
  if (!participant) {
    return {
      success: false,
      message: `Sorry no participant`,
    }
  }
  const event = await getEventById(participant.eventId);
  if (!event) {
    return {
      success: false,
      message: `No event with id ${participant.eventId} found.`,
    }
  }
  const eventURL = `${process.env.BETTER_AUTH_URL}/event/${participant.eventId}`
  const param = {
    name: participant.user.name,
    eventName : event?.name ?? "Barong Melali",
    eventDate : formatEventDate(event?.startDate),
    eventTime : formatEventTime(event?.startDate),
    meetingPoint : event.locationName ?? "",
    eventURL,
    bibNumber: participant?.bibNumber ?? undefined,
    jerseySize: participant?.jerseySize ?? undefined,
    category: participant?.category?.name ?? undefined,
  }

  await resend.emails.send({
    from: 'Barong Cycling Team <info@barongmelali.com>',
    to: [participant.user.email,],
    subject: 'Thanks for joining the event',
    react: EventJoinedEmail(param)
  })

  return {
    success: true,
    message: "Success, email has been sent.",
  }
}

export async function DeleteEventParticipantAction(formData: FormData): Promise<void> {
  const participantId = formData.get("participantId");
  await db.delete(participant).where(eq(participant.id, Number(participantId)))
  revalidatePath('/', 'layout');
}

export async function createParticipant(formData: InsertParticipantType) : Promise<ActionResponse> {
  const validate = participantInsertSchema.safeParse(formData)
  if (!validate.success) {
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(validate.error),
      fields: validate.data,
    }
  }

  await db.insert(participant).values(validate.data).returning()

  return  {
    success: true,
    message: "Success, "
  }
}

export async function updateParticipant(formData: UpdateParticipantType) : Promise<ActionResponse> {
  await db.update(participant).set(formData).where(eq(participant.id, Number(formData.id)))
  return {
    success: true,
    message: "Success, "
  }
}