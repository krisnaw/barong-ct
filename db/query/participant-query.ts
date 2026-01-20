"use server"

import {db} from "@/db/db";
import {and, desc, eq, getTableColumns, isNull} from "drizzle-orm";
import {participant, user, userDetail} from "@/db/schema";

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

export async function getPendingParticipants(eventId: number) {
  const usersNotJoined = await db
    .select({
      ...getTableColumns(user), phone: userDetail.phoneNumber
    })
    .from(user)
    .leftJoin(userDetail, eq(userDetail.userId, user.id))
    .leftJoin(
      participant,
      and(
        eq(participant.userId, user.id),
        eq(participant.eventId, eventId),
      )
    )
    .where(isNull(participant.id));
  return usersNotJoined;
}