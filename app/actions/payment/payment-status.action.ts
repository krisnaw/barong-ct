'use server'

import crypto from "crypto";
import {generateSignature} from "@/utils/doku-helper";
import {db} from "@/db/db";
import {eventOrder, eventPayment} from "@/db/schema";
import {eq} from "drizzle-orm";
import {createParticipant} from "@/service/participant.service";

const dokuBaseURL = process.env.DOKU_API_URL
const dokuReqPath = '/orders/v1/status/'
const clientID = process.env.DOKU_CLIENT_ID!
const clientSecret = process.env.DOKU_SECRET_KEY!
const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z"

export async function checkPaymentStatus(invoiceId: string) {
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
      console.log(body);
      if (body.transaction.status === "SUCCESS") {
        // update payment
        const [payment] = await db.update(eventPayment).set({status: body.transaction.status}).where(eq(eventPayment.invoiceNumber, invoiceId)).returning()

        const [order] = await db.update(eventOrder).set({status: 'paid'}).where(eq(eventOrder.id, payment.orderId)).returning({
          eventId: eventOrder.eventId,
          userId: eventOrder.userId,
        })

        if (order) {
          await createParticipant(order.eventId, order.userId)
        }

      } else if (body.transaction.status === "EXPIRED" || body.order.status === "ORDER_EXPIRED") {
        // update payment
        const setStatus = "EXPIRED"
        const [payment] = await db.update(eventPayment).set({status: setStatus}).where(eq(eventPayment.invoiceNumber, invoiceId)).returning();
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }

  }




}
