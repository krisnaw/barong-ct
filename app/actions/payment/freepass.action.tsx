"use server"

import {ActionResponse} from "@/types/types";
import {redirect} from "next/navigation";
import {db} from "@/db/db";
import {eventPayment, EventPaymentInsert} from "@/db/schema";
import {updateOrderStatus} from "@/service/order.service";
import {ORDER_STATUS, PAYMENT_STATUS} from "@/utils/event.helper";
import {getParticipantById} from "@/db/query/participant-query";

export async function processFreePass(payload: { participantId: number }) : Promise<ActionResponse> {
  const participant = await getParticipantById(payload.participantId)
  const invoiceNumber = generateInvoiceNumber();
  if (!participant) {
    redirect('/')
  }

  // create empty payment
  const paymentPayload : EventPaymentInsert = {
    participantId: participant.id,
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
  // await createParticipant(participant.eventId, participant.userId)

  // set participant as complete
  await updateOrderStatus(participant.id, ORDER_STATUS.COMPLETED)

  return {
    success: true,
    message: "Success, you have been registered."
  }
}


// TODO refactor this
function generateInvoiceNumber(): string {
  return `INV${Math.floor(Date.now() / 1000)}`;
}
