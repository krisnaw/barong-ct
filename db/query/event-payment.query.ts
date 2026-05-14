'use server'

import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {eventPayment} from "@/db/schema";
import {PAYMENT_STATUS} from "@/utils/event.helper";

export async function getPaymentByOrder(orderId: number) {
  return db.query.eventPayment.findFirst({
    where: eq(eventPayment.orderId, orderId),
    orderBy: (payment, {desc}) => [desc(payment.createdAt)],
  });
}

export async function getPendingPaymentByInvoice(invoiceNumber: string) {
  return db.query.eventPayment.findFirst({
    where: and(eq(eventPayment.invoiceNumber, invoiceNumber), eq(eventPayment.status, PAYMENT_STATUS.PENDING)),
  });
}