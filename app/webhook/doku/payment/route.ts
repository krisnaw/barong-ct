import {type NextRequest, NextResponse} from 'next/server'
import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {eventOrder, eventPayment} from "@/db/schema";
import {createParticipant} from "@/service/participant.service";

export async function POST(request: NextRequest) {

  const header = request.headers;
  console.log(header);
  // TODO: VERIFY HEADER
  const body = await request.json();
  console.log(body);
  console.log("Hey this is nextjs webhook")

  const invoiceNumber = body.order.invoice_number;
  const transactionStatus = body.transaction.status;

  const payment = await db.query.eventPayment.findFirst({
    where: and(eq(eventPayment.invoiceNumber, invoiceNumber), eq(eventPayment.status, "PENDING")),
  })

  if (payment) {
    await db.update(eventPayment).set({status: transactionStatus}).where(eq(eventPayment.id, payment.id))

    const [order] = await db.update(eventOrder).set({status: 'paid'}).where(eq(eventOrder.id, payment.orderId)).returning({
      eventId: eventOrder.eventId,
      userId: eventOrder.userId,
    })

    if (order) {
      await createParticipant(order.eventId, order.userId)
    }
  }

  return NextResponse.json({ success: true }, {status: 200})
}