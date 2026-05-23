'use server'

import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {eventOrder} from "@/db/schema";
import {ORDER_STATUS} from "@/utils/event.helper";

export async function getOrderByEvent(eventId: number) {
  return db.query.eventOrder.findMany({
    where: and(eq(eventOrder.eventId, eventId), eq(eventOrder.status, ORDER_STATUS.COMPLETED)),
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
      participant: {
        columns: {
          bibNumber: true,
        }
      }
    }
  });
}

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