"use server"

import {EventSchema, participant} from "@/db/schema";
import {db} from "@/db/db";
import {and, desc, eq} from "drizzle-orm";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";

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

export type EventWithDetail = NonNullable<Awaited<ReturnType<typeof getEventById>>>

export type EventList = Awaited<ReturnType<typeof getEvents>>
export type EventLastActive = Awaited<ReturnType<typeof getLastActiveEvent>>
export type EventByUser = Awaited<ReturnType<typeof getEventsByUserId>>

export async function getEventsByUserId(userId: string) {
  const userEvents = await db.query.participant.findMany({
    where: and(eq(participant.userId, userId), eq(participant.status, PARTICIPANT_STATUS.COMPLETED)),
    with: {
      event: {
        with: {
          categories: true,
        },
      },
    },
  });

  return userEvents.map((p) => p.event).filter(Boolean) as EventWithDetail[];
}