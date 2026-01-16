'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "@/db/db";
import {participant} from "@/db/schema";
import {Resend} from "resend";
import CyclingEventConfirmationEmail from "@/react-email-starter/emails/event-registration-email";
import {getEventById} from "@/db/query/event-query";
import {revalidatePath} from "next/cache";
import {toZonedTime} from "date-fns-tz";
import {formatEventDate, formatEventTime} from "@/types/date-helper";
import {eq} from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinEventAction(payload: {  eventId: string }) : Promise<ActionResponse> {

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect("/auth/signup")
  }

  const event = await getEventById(Number(payload.eventId));

  if (!event) {
    redirect("/auth/signup")
  }

  try {
    await db.insert(participant).values({
      userId: session.user.id,
      eventId: Number(payload.eventId),
    }).onConflictDoNothing()

    const zonedDate = toZonedTime(event.startDate, 'Asia/Singapore')
    console.log(zonedDate)
    console.log(formatEventTime(event.startDate))

    const param = {
      name: session.user.name,
      eventName : event.name,
      eventDate : formatEventDate(event.startDate),
      eventTime : formatEventTime(event.startDate),
      meetingPoint : event.locationName ?? "",
    }

    await resend.emails.send({
      from: 'Barong Cycling Team <info@barongmelali.com>',
      to: [session.user.email],
      subject: 'Thanks for joining the event',
      react: CyclingEventConfirmationEmail(param)
    })

  } catch (error) {
    console.log(error);
  }

  revalidatePath('/', 'layout')

  return {
    success: true,
    message: "Success, you have joined this event",
  }
}

export async function DeleteEventParticipantAction(formData: FormData): Promise<void> {
  const participantId = formData.get("participantId");
  await db.delete(participant).where(eq(participant.id, Number(participantId)))
  revalidatePath('/', 'layout');
}