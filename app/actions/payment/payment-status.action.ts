'use server'

import crypto from "crypto";
import {generateSignature} from "@/utils/doku-helper";
import {db} from "@/db/db";
import {eventPayment} from "@/db/schema";
import {eq} from "drizzle-orm";
import {PAYMENT_STATUS} from "@/utils/event.helper";
import {revalidatePath} from "next/cache";

const dokuBaseURL = process.env.DOKU_API_URL
const dokuReqPath = '/orders/v1/status/'
const clientID = process.env.DOKU_CLIENT_ID!
const clientSecret = process.env.DOKU_SECRET_KEY!

export async function checkPaymentStatus(invoiceId: string) {
  console.log("Checking Payment Status...")
  const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z"
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

      const status = body.transaction.status;

      console.log("request success");
      console.log(body);

      // update payment to expired
      if (status === PAYMENT_STATUS.EXPIRED || status === PAYMENT_STATUS.ORDER_EXPIRED) {
        await db.update(eventPayment).set({status: status}).where(eq(eventPayment.invoiceNumber, invoiceId)).returning();
        revalidatePath("/")
      }

      return { success: true, status };
    }

    return { success: false, status: null };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      console.log("Sorry something wrong")
      console.log(error.message);
    }
    return { success: false, status: null };
  }

}

export async function updatePaymentStatusToExpired(invoiceId: string) {
  try {
    await db.update(eventPayment).set({status: PAYMENT_STATUS.EXPIRED}).where(eq(eventPayment.invoiceNumber, invoiceId)).returning();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}
