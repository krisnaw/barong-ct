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

const dokuBaseURL = process.env.DOKU_API_URL
const dokuReqPath = '/checkout/v1/payment'
const clientID = process.env.DOKU_CLIENT_ID!
const clientSecret = process.env.DOKU_SECRET_KEY!
const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z"
const baseURL = process.env.BETTER_AUTH_URL!

export async function createPayment(payload: { oderId: number, total: number }): Promise<ActionResponse> {

  const order = await db.query.eventOrder.findFirst({
    where: eq(eventOrder.id, payload.oderId),
  })

  if (!order) {
    redirect('/')
  }

  const invoiceNumber = generateInvoiceNumber();

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

function generateInvoiceNumber(): string {
  return `INV${Math.floor(Date.now() / 1000)}`;
}
