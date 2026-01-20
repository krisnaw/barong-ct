'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "@/db/db";
import {participant} from "@/db/schema";
import {Resend} from "resend";
import {getEventById} from "@/db/query/event-query";
import {revalidatePath} from "next/cache";
import {formatEventDate, formatEventTime} from "@/types/date-helper";
import {eq} from "drizzle-orm";
import EventJoinedEmail from "@/react-email-starter/emails/event-joined-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resendEmailConfirmation(payload: {eventId: string, userId: string, name: string, email: string}): Promise<ActionResponse> {
  const event = await getEventById(Number(payload.eventId));
  const eventURL = `${process.env.BETTER_AUTH_URL}/event/${payload.eventId}`
  if (!event) {
    return {
      success: false,
      message: `No event with id ${payload.eventId} found.`,
    }
  }

  const param = {
    name: payload.name,
    eventName : event.name ?? "There",
    eventDate : formatEventDate(event.startDate),
    eventTime : formatEventTime(event.startDate),
    meetingPoint : event.locationName ?? "",
    eventURL
  }

  await resend.emails.send({
    from: 'Barong Cycling Team <info@barongmelali.com>',
    to: [payload.email],
    subject: 'Thanks for joining the event',
    react: EventJoinedEmail(param)
  })

  return {
    success: true,
    message: "Success, email has been sent.",
  }
}

export async function addParticipant(payload: {eventId: string, userId: string, name: string, email: string}): Promise<ActionResponse> {
  try {
    await db.insert(participant).values({
      userId: payload.userId,
      eventId: Number(payload.eventId),
    }).onConflictDoNothing()

    const eventURL = `${process.env.BETTER_AUTH_URL}/event/${payload.eventId}`
    const event = await getEventById(Number(payload.eventId));
    if (!event) {
      return {
        success: false,
        message: `No event with id ${payload.eventId} found.`,
      }
    }

    const param = {
      name: payload.name,
      eventName : event.name ?? "There",
      eventDate : formatEventDate(event.startDate),
      eventTime : formatEventTime(event.startDate),
      meetingPoint : event.locationName ?? "",
      eventURL
    }

    await resend.emails.send({
      from: 'Barong Cycling Team <info@barongmelali.com>',
      to: [payload.email],
      subject: 'Thanks for joining the event',
      react: EventJoinedEmail(param)
    })

  } catch (error) {
    console.log(error);
  }

  revalidatePath("/", "layout")

  return {
    success: true,
    message: "Success, you have joined this event",
  }

}

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

    const eventURL = `${process.env.BETTER_AUTH_URL}/event/${event.id}`

    const param = {
      name: session.user.name,
      eventName : event.name ?? "There",
      eventDate : formatEventDate(event.startDate),
      eventTime : formatEventTime(event.startDate),
      meetingPoint : event.locationName ?? "",
      eventURL
    }

    await resend.emails.send({
      from: 'Barong Cycling Team <info@barongmelali.com>',
      to: [session.user.email],
      subject: 'Thanks for joining the event',
      react: EventJoinedEmail(param)
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