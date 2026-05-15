import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getEventById} from "@/db/query/event-query";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {getPromoByEvent} from "@/db/query/event-promo.query";
import {StepPayment} from "@/components/checkout/step-payment";
import {getPaymentByOrder} from "@/db/query/event-payment.query";
import {PAYMENT_STATUS} from "@/utils/event.helper";
import {checkPaymentStatus} from "@/app/actions/payment/payment-status.action";
import Link from "next/link";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect(`/auth/signup`)
  }

  const event = await getEventById(id)
  if (!event) {
    redirect(`/event`);
  }

  const order = await getOngoingOrder(id, session.user.id)
  if (!order) {
    redirect("/event")
  }

  const promos = await getPromoByEvent(id)

  // if there is pending payment, check the payment status.
  const payment = await getPaymentByOrder(order.id)
  if (payment) {
    if (payment.status == PAYMENT_STATUS.PENDING && payment.invoiceNumber) {
      await checkPaymentStatus(payment.invoiceNumber)
    }
  }

  return (
    <div>
      {payment ? (
        <div>
          {payment.status}
          {payment.status == PAYMENT_STATUS.PENDING && payment.paymentURL && (
            <Link href={payment.paymentURL}>Complete payment</Link>
          )}

          {payment.status == PAYMENT_STATUS.EXPIRED && (
            <StepPayment event={event} order={order} promos={promos} />
          )}
        </div>
      ) : (
        <StepPayment event={event} order={order} promos={promos} />
      )}
    </div>
  )
}