'use server'

import crypto from "crypto";
import {generateSignature} from "@/utils/doku-helper";
import {db} from "@/db/db";
import {eventPayment, participant} from "@/db/schema";
import {eq} from "drizzle-orm";
import {PARTICIPANT_STATUS, PAYMENT_STATUS} from "@/utils/event.helper";

const dokuBaseURL = process.env.DOKU_API_URL
const dokuReqPath = '/orders/v1/status/'
const clientID = process.env.DOKU_CLIENT_ID!
const clientSecret = process.env.DOKU_SECRET_KEY!
const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z"

export async function checkPaymentStatus(invoiceId: string) {
  console.log("Checking Payment Status...")
  const requestId = crypto.randomUUID().toString();
  const requestTarget = `${dokuReqPath}${invoiceId}`;
  const signature = generateSignature(
    clientID,
    requestId,
    requestTimestamp,
    requestTarget,
    clientSecret
  );
  const myHeaders = new Headers();
  myHeaders.append("Client-Id", clientID);
  myHeaders.append("Request-Id", requestId);
  myHeaders.append("Request-Timestamp", requestTimestamp);
  myHeaders.append("Signature", signature);
  myHeaders.append("Content-Type", "application/json");
  
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const res = await fetch(`${dokuBaseURL}${dokuReqPath}${invoiceId}`, requestOptions);

    if (res.ok) {
      const body = await res.json();
      if (body.transaction.status === PAYMENT_STATUS.SUCCESS) {
        // update payment
        const [payment] = await db.update(eventPayment).set({status: body.transaction.status}).where(eq(eventPayment.invoiceNumber, invoiceId)).returning()

        console.log('participant update ')
        const [user] = await db.update(participant).set({ status: PARTICIPANT_STATUS.COMPLETED }).where(eq(participant.id, payment.participantId)).returning()
        console.log(user)

      } else if (body.transaction.status === PAYMENT_STATUS.EXPIRED || body.order.status === PAYMENT_STATUS.ORDER_EXPIRED) {
        // update payment
        await db.update(eventPayment).set({status: body.transaction.status}).where(eq(eventPayment.invoiceNumber, invoiceId)).returning();
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }

  }




}
