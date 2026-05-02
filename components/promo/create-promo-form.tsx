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
import {createPromoAction} from "@/app/actions/profile/promo/promo.action";

interface CreatePromoFormProps {
  eventId: number;
  onSuccess?: () => void;
}

export function CreatePromoForm({ eventId, onSuccess }: CreatePromoFormProps) {
  const promoId = useId();
  const discountValueId = useId();
  const startsAtId = useId();
  const endsAtId = useId();
  
  const [startsAt, setStartsAt] = useState<Date | null>(null);
  const [endsAt, setEndsAt] = useState<Date | null>(null);

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {
    const payload = {
      eventId: eventId,
      promo: formData.get("promo") as string,
      discountValue: Number(formData.get("discountValue")),
      startsAt: startsAt,
      endsAt: endsAt,
      isActive: formData.get("isActive") === "true",
    }

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