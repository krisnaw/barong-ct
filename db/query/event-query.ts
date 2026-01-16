"use server"

import {EventSchema, EventType} from "@/db/schema";
import {participant} from "@/db/schema/participant-schema";
import {db} from "@/db/db";
import {eq} from "drizzle-orm";

export async function getEvents(): Promise<(EventType & { participantCount: number })[] | []> {

  // @ts-ignore
  const events = await db.select({
    ...EventSchema,
    participantCount: db.$count(participant, eq(participant.eventId, EventSchema.id))
  })
    .from(EventSchema)
    .limit(10)

  if (events.length === 0) {
    return [];
  }

  return events as (EventType & { participantCount: number })[]
}

export async function getEventById(id: number): Promise<(EventType & { participantCount: number}) | undefined> {
  // @ts-ignore
  const event = await db.select({
    ...EventSchema,
    participantCount: db.$count(participant, eq(participant.eventId, EventSchema.id))
  })
    .from(EventSchema)
    .where(eq(EventSchema.id, id))

  if (!event) {
    return undefined;
  }

  return event[0] as EventType & { participantCount: number };
}

export async function getEventsByUserId(userId: string): Promise<(EventType & { participantCount: number })[]> {
  const userEvents = await db.query.participant.findMany({
    where: eq(participant.userId, userId),
    with: {
      event: {
        with: {
          participants: true
        }
      }
    }
  })

  return userEvents.map(p => ({
    ...p.event,
    participantCount: p.event.participants.length
  }))
}