import {type NextRequest, NextResponse} from 'next/server'
import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {eventOrder, eventPayment} from "@/db/schema";
import {createParticipant} from "@/service/participant.service";
import {getOrderById} from "@/db/query/event-order.query";

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
    where: and(eq(eventPayment.invoiceNumber, invoiceNumber)),
  })

  if (payment) {

    await db.update(eventPayment).set({status: transactionStatus});

    await db.update(eventOrder).set({status: 'paid'}).where(eq(eventOrder.id, payment.orderId))

    const order = await getOrderById(payment.orderId)
    if (order) {
      await createParticipant(order.eventId, order.userId)
    }
  }

  return NextResponse.json({ success: true }, {status: 200})
}