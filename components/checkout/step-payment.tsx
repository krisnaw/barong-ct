'use client'

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {redirect, useRouter} from "next/navigation";
import {useActionState, useState} from "react";
import {initialState} from "@/types/types";
import {EventCategoryType, EventType, ParticipantType} from "@/db/schema";
import {PromoType} from "@/db/schema/event-promo.schema";
import {Spinner} from "@/components/ui/spinner";

import {formatMoney} from "@/utils/money-helper";
import {Input} from "@/components/ui/input";
import {createPayment} from "@/app/actions/payment/payment.action";
import {Item, ItemContent} from "@/components/ui/item";
import {Separator} from "@/components/ui/separator";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Field, FieldContent, FieldDescription, FieldLabel, FieldTitle} from "@/components/ui/field";
import {processFreePass} from "@/app/actions/payment/freepass.action";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {updateParticipant} from "@/app/actions/event-participant/event-participant.action";

interface Props {
  event: EventType & { participantCount: number },
  participant: ParticipantType,
  category: EventCategoryType,
  promos: PromoType[] | null
}

const methods = [
  {
    formID: 'pm-bni-va',
    value: ["VIRTUAL_ACCOUNT_BNI"],
    label: "BNI Virtual Account",
    description: "20% OFF WITH BNI VA",
  },
  {
    formID: 'pm-qris-cc',
    value: ["QRIS", "CREDIT_CARD"],
    label: "QRIS / CREDIT CARD",
    description: "Pay using QRIS or Credit Card",
  },
]

export function StepPayment({event, participant, category, promos}: Props) {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoId, setPromoId] = useState<number | undefined>(undefined);
  const [pm, setPM] = useState<string[]>([])

  const price = Number(participant.price);
  const fee = category.serviceFee ?? 0;

  const isFreePass = discount >= price;

  // Calculate total price with or without discount
  const totalPrice = isFreePass ? 0 : price + fee - discount;

  const [state, formAction, isPending] = useActionState(async () => {

    // update participant status
    const participantPayload = {
      ...participant,
      promoCode,
      promoId: promoId,
      discountAmount: discount,
      finalPrice: totalPrice,
      status: PARTICIPANT_STATUS.PENDING_PAYMENT,
    };

    await updateParticipant(participantPayload)

    // create payment
    let res
    if (totalPrice == 0) {
      // store empty payment and create participant
      res = await processFreePass({participantId: participant.id})
      if (res.success) {
        redirect(`/event/${event.id}`)
      }
    } else {
      res = await createPayment({participantId: participant.id, pm});
      if (res.success) {
        router.push(res.data as string);
      }
    }
    return res
  }, initialState)

  const onClickApplyPromo = () => {
    if (!promos || promos.length === 0) {
      setDiscount(0);
      return;
    }
    applyPromoCode(promoCode)
  }

  const onChangePM = (value: string[]) => {
    setPM(value)
    if (!promos || promos.length === 0) {
      return;
    }
    const foundPromo = promos.find(promo =>
      promo.promo.toLowerCase() === value[0].toLowerCase()
    );
    if (foundPromo) {
      applyPromoCode(foundPromo.promo)
      setPromoCode(foundPromo.promo)
    } else {
      setDiscount(0)
      setPromoCode("")
    }
  }

  const applyPromoCode = (value: string) => {
    if (!promos || promos.length === 0) {
      setDiscount(0);
      return;
    }

    const foundPromo = promos.find(promo =>
      promo.promo.toLowerCase() === value.toLowerCase()
    );

    if (foundPromo) {
      const discountType = foundPromo.discountType;
      if (discountType === 'percentage') {
        const calculatedDiscount = price * (foundPromo.discountValue / 100);
        setDiscount(calculatedDiscount);
      } else {
        setDiscount(foundPromo.discountValue);
      }
      setPromoId(foundPromo.id);
    } else {
      setDiscount(0);
    }
  };

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>
            Step 3: Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">Select
                Payment Method
              </h2>
              <div className="mt-2">
                <RadioGroup
                  defaultValue={pm}
                  value={pm}
                  onValueChange={(value: string[]) => onChangePM(value)}
                  className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 style-sera:grid-cols-1"
                >

                  {methods.map((item) => (
                    <FieldLabel htmlFor={item.formID} key={item.formID}>
                      <Field orientation="horizontal" className="pb-2.5">
                        <RadioGroupItem value={item.value} id={item.formID}/>
                        <FieldContent>
                          <FieldTitle>{item.label}</FieldTitle>
                          <FieldDescription>{item.description}</FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div>
              <h2
                className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">Discount</h2>
              <div className="mt-2">
                {promos && promos.length > 0 && (
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
                      variant={promoCode.trim() ? 'default' : 'outline'}
                      onClick={onClickApplyPromo}
                      disabled={!promoCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">participant
              Summary</h2>
            <div className="mt-2 h-40">
              <Item variant="muted" className="flex-col items-stretch">
                <ItemContent className="gap-3">
                  <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Barong Melali 2026 - {category.name} ({category.description})
                  </span>
                    <span className="text-sm font-medium tabular-nums">
                    {formatMoney(Number(price))}
                  </span>
                  </div>
                  {!isFreePass && (
                    <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Processing Fee
                  </span>
                      <span className="text-sm font-medium tabular-nums">
                    {formatMoney(Number(fee))}
                  </span>
                    </div>
                  )}
                  <Separator/>
                  {discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600">
                        Discount
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-green-600">
                        {formatMoney(Number(discount))}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total
                  </span>
                    <span className="text-sm font-semibold tabular-nums">
                  {formatMoney(Number(totalPrice))}
                  </span>
                  </div>
                </ItemContent>
              </Item>
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isPending || pm.length == 0} type="submit">
            {isPending ? <Spinner/> : null}
            Complete Registration
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}


