"use server"

import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {participant} from "@/db/schema";

export async function checkParticipantByEvent(eventId: number, userId: string): Promise<boolean> {
  const user = await db.query.participant.findFirst({
    where: and(eq(participant.eventId, eventId), eq(participant.userId, userId)),
  })

  return !!user;
}

export async function getParticipantByEvent(eventId: number) {
  return await db.query.participant.findMany({
    where: eq(participant.eventId, eventId),
    with: {
      user: true
    }
  });
}