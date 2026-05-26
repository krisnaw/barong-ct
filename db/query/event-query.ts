"use server"

import {EventSchema, EventType} from "@/db/schema";
import {participant} from "@/db/schema/participant-schema";
import {db} from "@/db/db";
import {desc, eq} from "drizzle-orm";

export async function getLastActiveEvent() {
  return db.query.EventSchema.findFirst({
    orderBy: (desc(EventSchema.createdAt))
  })
}

export async function getEvents() {
  return db.query.EventSchema.findMany({
    orderBy: desc(EventSchema.createdAt)
  })
}

export async function getEventById(id: number) {
  return db.query.EventSchema.findFirst({
    where: eq(EventSchema.id, id),
    with: {
      categories: true,
    },
  });
}

export type EventWithDetail = Awaited<ReturnType<typeof getEventById>>
export type EventList = Awaited<ReturnType<typeof getEvents>>
export type EventLastActive = Awaited<ReturnType<typeof getLastActiveEvent>>
export type EventByUser = Awaited<ReturnType<typeof getEventsByUserId>>

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