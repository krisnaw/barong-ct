'use server'

import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {eventOrder} from "@/db/schema";

export async function getOngoingOrder(eventId: number, userId: string) {
  return db.query.eventOrder.findFirst({
    where: and(eq(eventOrder.eventId, eventId), eq(eventOrder.userId, userId))
  });
}

export async function getOrderByIdAndUser(orderId: number, userId: string) {
  return db.query.eventOrder.findFirst({
    where: and(eq(eventOrder.id, orderId), eq(eventOrder.userId, userId))
  });
}

export async function getOrderById(orderId: number) {
  return db.query.eventOrder.findFirst({
    where: eq(eventOrder.id, orderId)
  });
}

export async function getOrderByCategory(categoryId: number) {
  return db.query.eventOrder.findFirst({
    where: eq(eventOrder.categoryId, categoryId)
  });
}

export async function getOrderByPromo(promoId: number) {
  return db.query.eventOrder.findFirst({
    where: eq(eventOrder.promoId, promoId)
  });
}