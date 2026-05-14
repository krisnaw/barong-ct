"use server"

import {ActionResponse} from "@/types/types";
import {getOrderById} from "@/db/query/event-order.query";
import {redirect} from "next/navigation";
import {db} from "@/db/db";
import {eventPayment, EventPaymentInsert} from "@/db/schema";
import {createParticipant} from "@/service/participant.service";
import {updateOrderStatus} from "@/service/order.service";
import {ORDER_STATUS, PAYMENT_STATUS} from "@/utils/event.helper";

export async function processFreePass(payload: { oderId: number }) : Promise<ActionResponse> {
  const order = await getOrderById(payload.oderId)
  const invoiceNumber = generateInvoiceNumber();
  if (!order) {
    redirect('/')
  }

  // create empty payment
  const paymentPayload : EventPaymentInsert = {
    orderId: order.id,
    invoiceNumber: invoiceNumber,
    price: 0,
    currency: 'IDR',
    paymentURL: "",
    expiresAt: new Date(),
    status: PAYMENT_STATUS.SUCCESS
  }
  await db.insert(eventPayment)
    .values(paymentPayload)
    .returning();

  // create participant
  await createParticipant(order.eventId, order.userId)

  // set order as complete
  await updateOrderStatus(order.id, ORDER_STATUS.COMPLETED)

  return {
    success: true,
    message: "Success, you have been registered."
  }
}


// TODO refactor this
function generateInvoiceNumber(): string {
  return `INV${Math.floor(Date.now() / 1000)}`;
}
