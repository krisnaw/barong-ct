'use client'

import * as React from "react";
import {useActionState, useId, useState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {CustomDatePicker} from "@/components/ui/custom-date-picker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider";
import {createPromoAction} from "@/app/actions/profile/promo/promo.action";

interface CreatePromoFormProps {
  eventId: number;
  price? : number;
}

export function CreatePromoForm({ eventId, price }: CreatePromoFormProps) {
  const promoId = useId();
  const discountValueId = useId();
  const startsAtId = useId();
  const endsAtId = useId();
  const [startsAt, setStartsAt] = useState<Date | null>(null);
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const [discountType, setDiscountType] = useState("fixed")
  const [discountPercentage, setDiscountPercentage] = useState(0)

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {
    const discountType = formData.get("discount_type") as string;
    const discountValue = discountType === "percentage" && price
      ? Math.round(price * (discountPercentage / 100))
      : Number(formData.get("discountValue"));

    const payload = {
      eventId: eventId,
      promo: formData.get("promo") as string,
      discountType,
      discountValue,
      startsAt: startsAt,
      endsAt: endsAt,
      isActive: formData.get("isActive") === "true",
    }

    console.log("payload", payload)

    // Here you would create the actual action
    // For now, simulating response
    return await createPromoAction(payload)
  }, initialState)

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction}>
        <FieldGroup>

          <Field>
            <FieldLabel htmlFor={promoId}>Promo Code</FieldLabel>
            <Input
              id={promoId}
              type="text"
              name="promo"
              placeholder="SAVE10"
              required
            />
            <FieldDescription>
              Enter the promo code that users will use
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor={promoId}>Discount Type</FieldLabel>
            <RadioGroup defaultValue="fixed" name="discount_type" value={discountType} onValueChange={(value) => setDiscountType(value)}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Percentage</Label>
              </div>
            </RadioGroup>
          </Field>


          {discountType === "fixed" ? (
            <Field>
              <FieldLabel htmlFor={discountValueId}>
                Discount Value (IDR)
              </FieldLabel>
              <Input
                id={discountValueId}
                type="number"
                name="discountValue"
                placeholder="10000"
                min="0"
                step="1"
                required
              />
              <FieldDescription>
                Enter fixed discount amount in IDR
              </FieldDescription>
            </Field>
          ) : (
            <Field>
              <FieldLabel htmlFor={discountValueId}>
                Discount Percentage (IDR) {discountPercentage}
              </FieldLabel>

              <Slider
                value={[discountPercentage]}
                onValueChange={(val) => {
                  // Array.at(0) or val[0] works once we ensure it's an array
                  const newValue = Array.isArray(val) ? val[0] : val;
                  setDiscountPercentage(newValue);
                }}
                max={100}
                step={10}
                className="w-full"
              />

              <FieldDescription>
                Enter fixed discount amount in IDR
              </FieldDescription>
            </Field>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor={startsAtId}>Start Date & Time</FieldLabel>
              <CustomDatePicker name="startDate" value={startsAt || new Date()} />
              <FieldDescription>
                When the promo becomes active
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor={endsAtId}>End Date & Time</FieldLabel>
              <CustomDatePicker name="endDate" value={endsAt || new Date()} />
              <FieldDescription>
                When the promo expires (optional)
              </FieldDescription>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="isActive">Status</FieldLabel>
            <Select defaultValue="true" name="isActive">
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Set whether the promo is currently active
            </FieldDescription>
          </Field>

          <Field>
            <Button type="submit" disabled={isPending} size="lg">
              {isPending ? <Spinner /> : null }
              Create Promo
            </Button>
          </Field>

        </FieldGroup>
      </form>
    </div>
  )
}