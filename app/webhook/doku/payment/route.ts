import {type NextRequest, NextResponse} from 'next/server'
import {db} from "@/db/db";
import {and, eq} from "drizzle-orm";
import {eventOrder, eventPayment} from "@/db/schema";

export async function POST(request: NextRequest) {

  const header = await request.headers;
  console.log(header);
  const body = await request.json();
  console.log(body);
  console.log("Hey this is nextjs webhook")

  const invoiceNumber = body.order.invoice_number;
  const transactionStatus = body.transaction.status;

  const payment = await db.query.eventPayment.findFirst({
    where: and(eq(eventPayment.invoiceNumber, invoiceNumber), eq(eventPayment.status, "PENDING")),
  })

  if (payment) {
    await db.update(eventPayment).set({status: transactionStatus});

    await db.update(eventOrder).set({status: 'paid'}).where(eq(eventOrder.id, payment.orderId))
  }

  return NextResponse.json({ success: true }, {status: 200})
}