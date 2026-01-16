"use server"

import {EventSchema, EventType} from "@/db/schema";
import {participant} from "@/db/schema/participant-schema";
import {db} from "@/db/db";
import {eq} from "drizzle-orm";

export async function getEvents(): Promise<EventType[] | []> {
  return await db.query.EventSchema.findMany()
}

export async function getEventById(id: number): Promise<EventType | undefined> {
  const event = await db.query.EventSchema.findFirst({
    where: eq(EventSchema.id, id)
  })

  if (!event) {
    return undefined;
  }

  return event
}

export async function getEventsByUserId(userId: string): Promise<EventType[]> {
  const userEvents = await db.query.participant.findMany({
    where: eq(participant.userId, userId),
    with: {
      event: true
    }
  })

  return userEvents.map(p => p.event)
}