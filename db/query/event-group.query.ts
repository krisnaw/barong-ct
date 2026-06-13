'use server'

import {db} from "@/db/db";
import {asc, eq} from "drizzle-orm";
import {eventGroup} from "@/db/schema";

export async function getGroupById(groupId: number) {
  return db.query.eventGroup.findFirst({
    where: eq(eventGroup.id, groupId),
    with: {
      participants: {
        with: {
          user: true, // ← gets user.name and all user fields
        }
      }
    }
  });
}

export async function getGroupsByEvent(eventId: number) {
  return db.query.eventGroup.findMany({
    where: eq(eventGroup.eventId, eventId),
    orderBy: asc(eventGroup.name),
    with: {
      participants: {
        with: {
          user: {
            columns: { name: true },
          },
        },
      },
    },
  });
}
