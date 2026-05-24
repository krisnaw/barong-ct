'use server'

import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventGroup} from "@/db/schema";

export async function getGroupById(groupId: number) {
  return db.query.eventGroup.findFirst({
    where: eq(eventGroup.id, groupId),
    with: {
      participants: true
    }
  });
}

export async function getGroupsByEvent(eventId: number) {
  return db.query.eventGroup.findMany({
    where: eq(eventGroup.eventId, eventId)
  });
}