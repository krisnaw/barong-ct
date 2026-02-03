'use server'

import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {eventOrder} from "@/db/schema";

export async function getOngoingOrder(eventId: number, userId: string) {
  return await db.query.eventOrder.findFirst({
    where: and(eq(eventOrder.eventId, eventId), eq(eventOrder.userId, userId))
  })
}

export async function getOrderByIdAndUser(orderId: number, userId: string) {
  console.log(orderId, userId);
  return await db.query.eventOrder.findFirst({
    where: and(eq(eventOrder.id, orderId), eq(eventOrder.userId, userId))
  })
}