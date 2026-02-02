'use client'

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useActionState} from "react";
import {initialState} from "@/types/types";
import {EventType} from "@/db/schema";
import {createPayment} from "@/app/actions/payment/payment.action";
import {Spinner} from "@/components/ui/spinner";

export function StepPayment({event} : {event: EventType & { participantCount: number }}) {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const order = searchParams.get("order");

  const eventId = params.id;
  const router = useRouter();

  const price = Number(event.price);
  const fee = 25000;
  const total = price + fee;


  const [state, formAction, isPending] = useActionState(async () => {

    // create payment
    const res = await createPayment({oderId: Number(order)});
    console.log(res);
    if (res.success) {
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
                    {formatMoney(Number(total))}
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

