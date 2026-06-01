import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getEventById} from "@/db/query/event-query";
import {getPromoByEvent} from "@/db/query/event-promo.query";
import {getPaymentByParticipant} from "@/db/query/event-payment.query";
import {PAYMENT_STATUS} from "@/utils/event.helper";
import {checkPaymentStatus} from "@/app/actions/payment/payment-status.action";
import Link from "next/link";
import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import * as React from "react";
import {buttonVariants} from "@/components/ui/button";
import {getCategoryById} from "@/db/query/event-category.query";
import {getOnGoingParticipant} from "@/db/query/participant-query";
import {StepPayment} from "@/components/checkout/step-payment";
import {StepWizard} from "@/components/ui/step-wizard";
import {getRegistrationSteps} from "@/app/(home)/event/[id]/register/steps";

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

  const promos = await getPromoByEvent(id, true)
  const participant = await getOnGoingParticipant(event.id, session.user.id)
  if (!participant) {
    redirect("/event")
  }
  const category = await getCategoryById(participant.categoryId!)
  if (!category) {
    redirect("/event")
  }

  // Check payment status only when the invoice is pending AND past its expiry time.
  const payment = await getPaymentByParticipant(participant.id)
  if (payment?.status === PAYMENT_STATUS.PENDING && payment.invoiceNumber) {
    await checkPaymentStatus(payment.invoiceNumber)
  }

  return (
    <div className="space-y-6">
      <StepWizard steps={getRegistrationSteps("payment")} />
      {payment && payment.status === PAYMENT_STATUS.PENDING && payment.paymentURL ? (
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardAction>
              <Badge variant="secondary" className="uppercase">
                {payment.status}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Link href={payment.paymentURL} className={`${buttonVariants({ variant: "default", size: "lg" })} w-full uppercase`}>
              Complete payment
            </Link>
          </CardContent>
        </Card>
      ) : (
        <StepPayment event={event} participant={participant} category={category} promos={promos} />
      )}
    </div>
  )
}