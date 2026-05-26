'use server'

import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventPromoSchema} from "@/db/schema";

export async function getPromoByEvent(eventId: number) {
  return db.query.eventPromoSchema.findMany({
    where: eq(eventPromoSchema.eventId, eventId),
  });
}

export async function getPromoById(id: number) {
  return db.query.eventPromoSchema.findFirst({
    where: eq(eventPromoSchema.id, id),
  });
}