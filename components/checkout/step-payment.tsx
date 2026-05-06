'use client'

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useActionState, useState} from "react";
import {initialState} from "@/types/types";
import {EventOrderType, EventType} from "@/db/schema";
import {PromoType} from "@/db/schema/event-promo.schema";
import {Spinner} from "@/components/ui/spinner";
import {updateOrderAction} from "@/app/actions/event-order/event-order.action";
import {formatMoney} from "@/utils/money-helper";
import {Input} from "@/components/ui/input";
import {createPayment} from "@/app/actions/payment/payment.action";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Item, ItemContent} from "@/components/ui/item";

interface Props {
  event: EventType & { participantCount: number },
  order: EventOrderType,
  promos: PromoType[] | null
}

const INVOICE_ITEMS = [
  { item: "Design System License", qty: 1, unitPrice: 499 },
  { item: "Priority Support", qty: 12, unitPrice: 99 },
  { item: "Custom Components", qty: 3, unitPrice: 250 },
] as const

const subtotal = INVOICE_ITEMS.reduce(
  (sum, row) => sum + row.qty * row.unitPrice,
  0
)
const tax = 0
const totalDue = subtotal + tax

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function StepPayment({event, order, promos} : Props) {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoId, setPromoId] = useState<number | undefined>(undefined);

  const price = Number(event.price);
  const fee = event.serviceFee ?? 0;
  
  // Calculate total price with or without discount
  const totalPrice = price + fee - discount;

  const [state, formAction, isPending] = useActionState(async () => {

    // update order status
    const orderPayload = {
      ...order,          // copy
      promoCode,
      promoId: promoId,
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
        <CardContent>
          <Item variant="muted">
            <ItemContent>
              {promos && promos.length > 0 && (
                <div className="mb-4 w-full flex-1">

                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-white"
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
              )}
            </ItemContent>
          </Item>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead colSpan={3} className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              <TableRow>
                <TableCell>Ticket Price</TableCell>
                <TableCell colSpan={3} className="text-right tabular-nums">
                  {formatMoney(Number(price))}
                </TableCell>
              </TableRow>

              {discount > 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-right text-green-600">
                    Discount
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-green-600">{formatMoney(Number(discount))}</TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell colSpan={3} className="text-right">
                  Service Fee
                </TableCell>
                <TableCell className="text-right tabular-nums max-w-sm">{formatMoney(Number(fee))}</TableCell>
              </TableRow>


              <TableRow>
                <TableCell colSpan={3} className="text-right">
                  Total
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(Number(totalPrice))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? <Spinner/> : null}
            Complete Order
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}


