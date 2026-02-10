'use server'

import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventPayment} from "@/db/schema";

export async function getPaymentByOrder(orderId: number) {
  return await db.query.eventPayment.findFirst({
    where: eq(eventPayment.orderId, orderId),
    orderBy: (payment, { desc }) => [desc(payment.createdAt)],
  })
}