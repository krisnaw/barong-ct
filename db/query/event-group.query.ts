'use server'

import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventGroup} from "@/db/schema";

export async function getGroupByEvent(eventId: number, categoryId?: number) {
  return db.query.eventGroup.findMany({
    where: eq(eventGroup.eventId, eventId)
  })
}