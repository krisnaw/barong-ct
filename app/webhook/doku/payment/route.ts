import {type NextRequest, NextResponse} from 'next/server'
import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventPayment} from "@/db/schema";
import {generateDigest, generateSignature} from "@/utils/doku-helper";
import {getPendingPaymentByInvoice} from "@/db/query/event-payment.query";
import {markParticipantComplete} from "@/service/participant.service";
import {getParticipantById} from "@/db/query/participant-query";

export async function POST(request: NextRequest) {
  const header = request.headers;
  const rawBody = await request.text()
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
      const participant = await getParticipantById(payment.participantId)
      if (participant) {
        await markParticipantComplete(participant.eventId, participant.userId)
      }
    }
  }

  return NextResponse.json({ success: true }, {status: 200})
}