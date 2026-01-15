"use server"

import {EventSchema, EventType} from "@/db/schema";
import {db} from "@/db/db";
import {eq} from "drizzle-orm";

export async function getEvents(): Promise<EventType[] | []> {
  const events = await db.query.EventSchema.findMany()
  return events ?? []
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