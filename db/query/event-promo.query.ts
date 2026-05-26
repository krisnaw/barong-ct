'use server'

import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {eventPromoSchema} from "@/db/schema";

export async function getPromoByEvent(eventId: number, activeOnly?: false) {
  return db.query.eventPromoSchema.findMany({
    where: and(
      eq(eventPromoSchema.eventId, eventId),
      activeOnly ? eq(eventPromoSchema.isActive, true) : undefined),
  });
}

export async function getPromoById(id: number) {
  return db.query.eventPromoSchema.findFirst({
    where: eq(eventPromoSchema.id, id),
  });
}