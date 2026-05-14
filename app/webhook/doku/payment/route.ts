import {type NextRequest, NextResponse} from 'next/server'
import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventOrder, eventPayment} from "@/db/schema";
import {generateDigest, generateSignature} from "@/utils/doku-helper";
import {createParticipant} from "@/service/participant.service";
import {ORDER_STATUS} from "@/utils/event.helper";
import {getPendingPaymentByInvoice} from "@/db/query/event-payment.query";

export async function POST(request: NextRequest) {
  const header = request.headers;
  const rawBody = await request.text()
  console.log(rawBody)
  const digest = generateDigest(rawBody);

  const headerSignature = header.get("signature") as string;
  const clientId = header.get("client-id") as string;
  const requestId = header.get("request-id") as string;
  const requestTimestamp = header.get("request-timestamp") as string;
  const requestTarget = '/webhook/doku/payment'
  const clientSecret = process.env.DOKU_SECRET_KEY!

  const signature = generateSignature(clientId, requestId, requestTimestamp, requestTarget, clientSecret, digest);

  if (headerSignature === signature) {
    console.log("Signature match ")
    const body = JSON.parse(rawBody)
    console.log("body", body)

    const invoiceNumber = body.order.invoice_number;
    const transactionStatus = body.transaction.status;

    const payment = await getPendingPaymentByInvoice(invoiceNumber)

    if (payment) {
      await db.update(eventPayment).set({status: transactionStatus}).where(eq(eventPayment.id, payment.id))

      const [order] = await db.update(eventOrder).set({status: ORDER_STATUS.COMPLETED}).where(eq(eventOrder.id, payment.orderId)).returning({
        eventId: eventOrder.eventId,
        userId: eventOrder.userId,
      })

      if (order) {
        await createParticipant(order.eventId, order.userId)
      }
    }

  }

  return NextResponse.json({ success: true }, {status: 200})
}