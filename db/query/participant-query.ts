"use server"

import {db} from "@/db/db";
import {and, asc, desc, eq, getTableColumns, isNull} from "drizzle-orm";
import {participant, user, userDetail} from "@/db/schema";

export async function checkParticipantByEvent(eventId: number, userId: string): Promise<boolean> {
  const user = await db.query.participant.findFirst({
    where: and(eq(participant.eventId, eventId), eq(participant.userId, userId)),
  })

  return !!user;
}

export async function getParticipantByEvent(eventId: number, sortByName: boolean = false) {
  return db
    .select({
      participant,
      user,
      userDetail,
    })
    .from(participant)
    .innerJoin(user, eq(user.id, participant.userId))
    .leftJoin(userDetail, eq(userDetail.userId, user.id))
    .where(eq(participant.eventId, eventId))
    .orderBy(sortByName ? asc(user.name) : desc(participant.createdAt))
    .limit(100);
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