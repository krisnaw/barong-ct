"use server"

import {db} from "@/db/db";
import {and, desc, eq} from "drizzle-orm";
import {participant, user} from "@/db/schema";

export async function checkParticipantByEvent(eventId: number, userId: string): Promise<boolean> {
  const user = await db.query.participant.findFirst({
    where: and(eq(participant.eventId, eventId), eq(participant.userId, userId)),
  })

  return !!user;
}

export async function getParticipantByEvent(eventId: number) {

  const participants = await db
    .select({
      participant,
      user,
    })
    .from(participant)
    .innerJoin(user, eq(user.id, participant.userId))
    .where(eq(participant.eventId, eventId))
    .orderBy(desc(participant.createdAt))
    .limit(100)

  return participants;
}