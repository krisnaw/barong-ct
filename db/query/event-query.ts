"use server"

import {EventSchema, EventType} from "@/db/schema";
import {participant} from "@/db/schema/participant-schema";
import {db} from "@/db/db";
import {count, desc, eq, getTableColumns} from "drizzle-orm";

export async function getEvents(): Promise<(EventType & { participantCount: number })[] | []> {

  const events = await db
    .select({
      ...getTableColumns(EventSchema),
      participantCount: count(participant.id)
    })
    .from(EventSchema)
    .leftJoin(participant, eq(EventSchema.id, participant.eventId))
    .groupBy(EventSchema.id)
    .orderBy(desc(EventSchema.createdAt))
    .limit(10);

  return events as (EventType & { participantCount: number })[]
}

export async function getEventById(id: number): Promise<(EventType & { participantCount: number}) | undefined> {

  const [event] = await db
    .select({
      ...getTableColumns(EventSchema),
      participantCount: count(participant.id),
    })
    .from(EventSchema)
    .leftJoin(participant, eq(EventSchema.id, participant.eventId))
    .where(eq(EventSchema.id, id))
    .groupBy(EventSchema.id)
    .limit(1);

  return event as EventType & { participantCount: number };
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