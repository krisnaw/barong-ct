"use server"

import {db} from "@/db/db";
import {and, eq, getTableColumns, isNull, ne} from "drizzle-orm";
import {eventCategory, eventGroup, participant, user, userDetail} from "@/db/schema";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";

export async function getOnGoingParticipant(eventId: number, userId: string) {
  return db.query.participant.findFirst({
    where: and(eq(participant.eventId, eventId), eq(participant.userId, userId)),
    with: {
      category: {
        columns: {
          name: true
        }
      },
      group: {
        columns: {
          name: true
        }
      }
    }
  });
}

export type getOnGoingParticipantType = Awaited<ReturnType<typeof getOnGoingParticipant>>

export async function getParticipantById(id: number) {
  return db.query.participant.findFirst({
    where: and(eq(participant.id, id)),
    with: {
      category: {
        columns: {
          name: true
        }
      },
      user: {
        columns: {
          name: true,
          email: true
        }
      },
      event: {
        columns: {
          name: true,
          locationName: true,
          startDate: true,
          feature_image: true,
        }
      }
    }
  });
}

export async function getParticipantDetail(id: number) {
  return db.query.participant.findFirst({
    where: eq(participant.id, id),
    with: {
      user: true,
      event: {
        columns: { id: true, name: true, locationName: true, startDate: true }
      },
      category: true,
      group: true,
      payments: {
        orderBy: (p, { desc }) => [desc(p.createdAt)],
      },
    },
  })
}

export type ParticipantDetailType = Awaited<ReturnType<typeof getParticipantDetail>>

export async function getParticipantByEventUser(eventId: number, userId: string) {
  return db.query.participant.findFirst({
    where: and(eq(participant.eventId, eventId), eq(participant.userId, userId)),
    with: {
      category: {
        columns: {
          name: true
        }
      },
      group: {
        columns: {
          name: true
        }
      }
    }
  })
}

export async function checkParticipantByEvent(eventId: number, userId: string): Promise<boolean> {
  const user = await db.query.participant.findFirst({
    where: and(eq(participant.eventId, eventId), eq(participant.userId, userId)),
  })

  return !!user;
}

export async function getPendingParticipantByEvent(eventId: number) {
  return db.query.participant.findMany({
    where: and(eq(participant.eventId, eventId), ne(participant.status, PARTICIPANT_STATUS.COMPLETED)),
    with: {
      user: {
        columns: {
          name: true,
          email: true,
        }
      },
      payments: {
        columns: {
          status: true,
          invoiceNumber: true,
        },
        limit: 1,
        orderBy: (payment, { desc }) => [desc(payment.createdAt)],
      },
    },
    orderBy: (participant, { asc }) => [asc(participant.status)],
  });
}

export async function getParticipantByEvent(eventId: number) {
  return db.query.participant.findMany({
    where: and(eq(participant.eventId, eventId), eq(participant.status, PARTICIPANT_STATUS.COMPLETED)),
    with: {
      user: {
        columns: {
          name: true,
          email: true,
        }
      },
      group: {
        columns: {
          name: true,
        }
      },
      category: {
        columns: {
          name: true,
          price: true
        }
      },
      payments: {
        columns: {
          status: true,
          invoiceNumber: true,
        },
        limit: 1,
        orderBy: (payment, { desc }) => [desc(payment.createdAt)],
      },
    },
  })
}

export type ParticipantType = Awaited<ReturnType<typeof getParticipantByEvent>>[number]


export async function getPendingParticipants(eventId: number) {
  return await db
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

export async function getParticipantsForDownload(eventId: number) {
  return db
    .select({
      bibNumber: participant.bibNumber,
      jerseySize: participant.jerseySize,
      userName: user.name,
      userEmail: user.email,
      phone: userDetail.phoneNumber,
      categoryName: eventCategory.name,
      groupName: eventGroup.name,
    })
    .from(participant)
    .leftJoin(user, eq(participant.userId, user.id))
    .leftJoin(userDetail, eq(userDetail.userId, user.id))
    .leftJoin(eventCategory, eq(participant.categoryId, eventCategory.id))
    .leftJoin(eventGroup, eq(participant.groupId, eventGroup.id))
    .where(and(eq(participant.eventId, eventId), eq(participant.status, PARTICIPANT_STATUS.COMPLETED)))
    .orderBy(participant.bibNumber)
}
