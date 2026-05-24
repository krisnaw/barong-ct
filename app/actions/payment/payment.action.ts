"use server"

import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";

import {getUserWithDetail} from "@/db/query/user-query";
import {getEventById} from "@/db/query/event-query";
import crypto from "crypto";
import {generateDigest, generateInvoiceNumber, generateSignature} from "@/utils/doku-helper";
import {eventPayment} from "@/db/schema";
import {redirect} from "next/navigation";
import {getParticipantById} from "@/db/query/participant-query";

const dokuBaseURL = process.env.DOKU_API_URL
const dokuReqPath = '/checkout/v1/payment'
const clientID = process.env.DOKU_CLIENT_ID!
const clientSecret = process.env.DOKU_SECRET_KEY!
const baseURL = process.env.BETTER_AUTH_URL!

export async function createPayment(payload: { participantId: number, pm : string[] }): Promise<ActionResponse> {

  const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z"

  const participant = await getParticipantById(payload.participantId)

  if (!participant) {
    redirect('/')
  }

  const invoiceNumber = generateInvoiceNumber();

  const user = await getUserWithDetail(participant.userId);
  const event = await getEventById(participant.eventId);

  if (!event) {
    return {
      success: false,
      message: "Sorry, please try again later",
    }
  }

  // create payment
  const raw = JSON.stringify({
    "order": {
      "amount": participant.finalPrice,
      "invoice_number": invoiceNumber,
      "currency": participant.currency,
      "callback_url": `${baseURL}/event/${participant.eventId}`,
      "callback_url_cancel": `${baseURL}/payment/cancel`,
      "callback_url_result": `${baseURL}/event/${participant.eventId}`,
      "auto_redirect":true,
      "line_items": [
        {
          "name": event.name,
          "price": (participant.price! - (participant.discountAmount ?? 0)),
          "quantity": 1
        },
        {
          "name": "Service Fee",
          "price" : 15000,
          "quantity": 1
        }
      ]
    },
    "payment": {
      "payment_due_date": 45,
      "payment_method_types": payload.pm
    },
    "customer": {
      "name": user.name,
      "email": user.email,
    }
  });

  const requestId = crypto.randomUUID().toString();

  const digest = generateDigest(raw);
  const signature = generateSignature(
    clientID,
    requestId,
    requestTimestamp,
    dokuReqPath,
    clientSecret,
    digest
  );
  const myHeaders = new Headers();
  myHeaders.append("Client-Id", clientID);
  myHeaders.append("Request-Id", requestId);
  myHeaders.append("Request-Timestamp", requestTimestamp);
  myHeaders.append("Signature", signature);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const res = await fetch(`${dokuBaseURL}${dokuReqPath}`, requestOptions);

  const body = await res.json();

  if (!res.ok) {
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message;

    console.error("Fetch failed:", message);
    return {
      success: false, message: "Sorry, please try again later",
    }
  }

  // create payment
  const paymentPayload = {
    participantId: participant.id,
    invoiceNumber: invoiceNumber,
    price: body.response.order.amount,
    currency: body.response.order.currency,
    paymentURL: body.response.payment.url,
    expiresAt: new Date(body.response.payment.expired_datetime),
    status: "PENDING"
  }

  await db.insert(eventPayment)
    .values(paymentPayload)
    .returning();

  return {
    success: true,
    message: "Success, ",
    data: body.response.payment.url
  }
}


