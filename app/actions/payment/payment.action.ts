"use server"

import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";

import {getUserWithDetail} from "@/db/query/user-query";
import {getEventById} from "@/db/query/event-query";
import crypto from "crypto";
import {generateDigest, generateSignature} from "@/utils/doku-helper";
import {eq} from "drizzle-orm";
import {eventOrder, eventPayment} from "@/db/schema";
import {redirect} from "next/navigation";

const dokuURL = `https://api-sandbox.doku.com/checkout/v1/payment`
const clientID = "BRN-0214-1768988713930";
const clientSecret = "SK-gNOBMPI626KaB8Uw39Ij";
const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z"
const baseURL = process.env.BETTER_AUTH_URL!

export async function createPayment(payload: { oderId: number, total: number }): Promise<ActionResponse> {

  const order = await db.query.eventOrder.findFirst({
    where: eq(eventOrder.id, payload.oderId),
  })

  if (!order) {
    redirect('/')
  }

  const invoiceNumber = generateInvoiceNumber(order.eventId, order.userId);

  const user = await getUserWithDetail(order.userId);
  const event = await getEventById(order.eventId);

  if (!event) {
    return {
      success: false,
      message: "Sorry, please try again later",
    }
  }

  // create payment
  const raw = JSON.stringify({
    "order": {
      "amount": payload.total,
      "invoice_number": invoiceNumber,
      "currency": order.currency,
      "callback_url": `${baseURL}/event/${order.eventId}`,
      "callback_url_cancel": `${baseURL}/payment/cancel`,
      "callback_url_result": `${baseURL}/event/${order.eventId}`,
      "line_items": [
        {
          "name": event.name,
          "price": payload.total,
          "quantity": 1
        }
      ]
    },
    "payment": {
      "payment_due_date": 60
    },
    "customer": {
      "name": user.name,
      "email": user.email,
      "phone": user.detail.phoneNumber
    }
  });

  const requestId = crypto.randomUUID().toString();
  const requestTarget = "/checkout/v1/payment";
  const digest = generateDigest(raw);
  const signature = generateSignature(
    clientID,
    requestId,
    requestTimestamp,
    requestTarget,
    digest,
    clientSecret
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

  const res = await fetch(dokuURL, requestOptions);

  const body = await res.json();
  console.log(body);

  if (!res.ok) {
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message;

    console.error("Fetch failed:", message);
  }

  // create payment
  const paymentPayload = {
    orderId: order.id,
    invoiceNumber: invoiceNumber,
    price: body.response.order.amount,
    currency: body.response.order.currency,
    paymentUrl: body.response.payment.url,
    expiresAt: new Date(body.response.payment.expired_datetime),
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

function generateInvoiceNumber(
  eventId: number,
  userId: string
): string {
  const now = new Date();

  const timestamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0") +
    String(now.getMilliseconds()).padStart(3, "0");

  // Take first 4 chars of UUID (safe, non-PII)
  const userShort = userId.replace(/-/g, "").slice(0, 4).toUpperCase();

  return `EVT-${eventId}-${timestamp}-${userShort}`;
}
