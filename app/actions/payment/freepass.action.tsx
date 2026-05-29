"use server"

import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {eventPayment, EventPaymentInsert, UpdateParticipantType} from "@/db/schema";
import {PARTICIPANT_STATUS, PAYMENT_STATUS} from "@/utils/event.helper";
import {getParticipantById} from "@/db/query/participant-query";
import {updateParticipant} from "@/app/actions/event-participant/event-participant.action";
import {getPromoById} from "@/db/query/event-promo.query";
import {generateBibNumber} from "@/utils/bib.helper";
import {getUserWithDetail} from "@/db/query/user-query";

export async function processFreePass(payload: { participantId: number, promoId: number, discountAmount: number }) : Promise<ActionResponse> {
  const participant = await getParticipantById(payload.participantId)
  const promo = await getPromoById(payload.promoId)
  const invoiceNumber = generateInvoiceNumber();
  if (!participant || !promo) {
    return {
      success: false,
      message: "Sorry, something wrong please try again later"
    }
  }

  const user = await getUserWithDetail(participant.userId)
  const bibNumber = await generateBibNumber(user.detail.gender as "male" | "female", promo.eventId)
  if (bibNumber) {
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

    const updateParticipantPayload : UpdateParticipantType = {
      id: participant.id,
      status: PARTICIPANT_STATUS.COMPLETED,
      price: 0,
      serviceFee: 0,
      finalPrice: 0,
      promoId: promo.id,
      discountAmount: payload.discountAmount,
      promoCode: promo.promo,
      bibNumber: bibNumber
    }

    await updateParticipant(updateParticipantPayload)

    return {
      success: true,
      message: "Success, you have been registered."
    }
  }

  return {
    success: false,
    message: "Sorry, something wrong please try again later"
  }

}


// TODO refactor this
function generateInvoiceNumber(): string {
  return `INV${Math.floor(Date.now() / 1000)}`;
}
