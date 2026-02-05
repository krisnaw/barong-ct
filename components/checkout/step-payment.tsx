'use client'

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useActionState} from "react";
import {initialState} from "@/types/types";
import {EventOrderType, EventType} from "@/db/schema";
import {createPayment} from "@/app/actions/payment/payment.action";
import {Spinner} from "@/components/ui/spinner";
import {updateOrderAction} from "@/app/actions/event-order/event-order.action";

export function StepPayment({event, order} : {event: EventType & { participantCount: number }, order: EventOrderType}) {
  const router = useRouter();

  const price = Number(event.price);
  const fee = 25000;

  const [state, formAction, isPending] = useActionState(async () => {

    // create payment
    const res = await createPayment({oderId: order.id});
    if (res.success) {

      // update order status
      const orderPayload = {
        ...order,          // copy
        status: "payment",  // modify ONE field
      };
      await updateOrderAction(orderPayload)

      router.push(res.data as string);
    }

    return res
  }, initialState)


  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>


        </CardContent>
        <CardFooter>

          <div className="flex flex-col w-full">
            <div className="w-full">
              <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <dt>Registration fee</dt>
                  <dd className="text-gray-900">{formatMoney(Number(price))}</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Service fee</dt>
                  <dd className="text-gray-900">{formatMoney(Number(25000))}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                    {formatMoney(Number(price + fee))}
                  </dd>
                </div>
              </dl>

            </div>

            <div className="mt-6">
              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? <Spinner/> : null}
                Complete Order
              </Button>
            </div>
          </div>


        </CardFooter>
      </Card>
    </form>
  )
}


const formatMoney = (amount: number, currency = 'IDR', locale = 'id-ID') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

