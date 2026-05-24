"use server"

import {db} from "@/db/db";
import {and, eq, getTableColumns, isNull} from "drizzle-orm";
import {participant, user, userDetail} from "@/db/schema";
import {ORDER_STATUS} from "@/utils/event.helper";

export async function getOnGoingParticipant(eventId: number, userId: string) {
  return db.query.participant.findFirst({
    where: and(eq(participant.eventId, eventId), eq(participant.userId, userId))
  });
}

export async function getParticipantById(id: number) {
  return db.query.participant.findFirst({
    where: and(eq(participant.id, id))
  });
}

export async function getParticipantByEventUser(eventId: number, userId: string) {
  return db.query.participant.findFirst({
    where: and(eq(participant.eventId, eventId), eq(participant.userId, userId)),
  })
}

export async function checkParticipantByEvent(eventId: number, userId: string): Promise<boolean> {
  const user = await db.query.participant.findFirst({
    where: and(eq(participant.eventId, eventId), eq(participant.userId, userId)),
  })

  return !!user;
}

export async function getParticipantByEvent(eventId: number, sortByName: boolean = false) {
  return db.query.participant.findMany({
    where: and(eq(participant.eventId, eventId), eq(participant.status, ORDER_STATUS.COMPLETED)),
    with: {
      user: {
        columns: {
          name: true,
          email: true,
        }
      },
      category: {
        columns: {
          name: true,
          price: true
        }
      },
    },
  })
}

export type ParticipantType = Awaited<ReturnType<typeof getParticipantByEvent>>[number]

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

export async function getParticipantByPromo(promoId: number) {
  return db.query.participant.findFirst({
    where: eq(participant.promoId, promoId)
  });
}

export async function getParticipantByCategory(categoryId: number) {
  return db.query.participant.findFirst({
    where: eq(participant.categoryId, categoryId)
  });
}
