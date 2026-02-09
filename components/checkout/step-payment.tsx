'use client'

import {Card, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useActionState, useState} from "react";
import {initialState} from "@/types/types";
import {EventOrderType, EventType} from "@/db/schema";
import {PromoType} from "@/db/schema/event-promo.schema";
import {createPayment} from "@/app/actions/payment/payment.action";
import {Spinner} from "@/components/ui/spinner";
import {updateOrderAction} from "@/app/actions/event-order/event-order.action";
import {formatMoney} from "@/utils/money-helper";
import {Input} from "@/components/ui/input";

interface Props {
  event: EventType & { participantCount: number },
  order: EventOrderType,
  promos: PromoType[] | null
}

export function StepPayment({event, order, promos} : Props) {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoId, setPromoId] = useState(0);

  const price = Number(event.price);
  const fee = 25000;
  
  // Calculate total price with or without discount
  const totalPrice = price + fee - discount;

  const [state, formAction, isPending] = useActionState(async () => {


    // update order status
    const orderPayload = {
      ...order,          // copy
      promoCode,
      promoId,
      discountAmount: discount,
      finalPrice: totalPrice,
      status: "payment",
    };
    await updateOrderAction(orderPayload)

    // create payment
    const res = await createPayment({oderId: order.id});
    if (res.success) {
      router.push(res.data as string);
    }

    return res
  }, initialState)

  const applyPromoCode = () => {
    if (!promos || promos.length === 0) {
      setDiscount(0);
      return;
    }

    const foundPromo = promos.find(promo => 
      promo.promo.toLowerCase() === promoCode.toLowerCase()
    );

    if (foundPromo) {
      setDiscount(foundPromo.discountValue);
      setPromoId(foundPromo.id);
    } else {
      setDiscount(0);
    }
  };


  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardFooter>

          <div className="flex flex-col w-full">

            <div className="mb-4 w-full flex-1">

              {promoId} - {promoCode} - {discount}

              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={applyPromoCode}
                  disabled={!promoCode.trim()}
                >
                  Apply
                </Button>
              </div>
            </div>

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

                {discount > 0 && (
                  <div className="flex justify-between">
                    <dt>Promo discount</dt>
                    <dd className="text-green-600">-{formatMoney(Number(discount))}</dd>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                    {formatMoney(Number(totalPrice))}
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


