'use client'

import * as React from "react";
import {useActionState, useState} from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CustomDatePicker} from "@/components/ui/custom-date-picker";
import {ActionResponse, initialState} from "@/types/types";
import {InsertPromoType} from "@/db/schema";
import {Slider} from "@/components/ui/slider";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";
import {createPromoAction} from "@/app/actions/event-promo/promo.action";

export function AddPromo({eventId}: { eventId: number }) {
  const [open, setOpen] = useState(false)
  const [discountType, setDiscountType] = useState("fixed")

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    async (_: ActionResponse, formData: FormData) => {
      const payload: InsertPromoType = {
        eventId: eventId,
        startsAt: new Date(`${formData.get("startsAt") as string}`),
        endsAt: new Date(`${formData.get("endDate") as string}`),
        currency: formData.get("currency") as string,
        promo: formData.get("promo") as string,
        discountValue: Number(formData.get("discountValue") as string),
        discountType: formData.get("discountType") as string,
        isActive: true,
      }

      const res = await createPromoAction(payload)
      toast.info(res.message)
      setOpen(!res.success)
      return res
    }, initialState);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline">Add Promo</Button>}/>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Promo</SheetTitle>
          <SheetDescription>Create a new promo code for this event.</SheetDescription>
        </SheetHeader>
        <form id="add-promo-form" action={formAction}>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="promo">Promo Code</FieldLabel>
                <Input
                  id="promo"
                  type="text"
                  name="promo"
                  placeholder="SAVE10"
                />
                <FieldDescription>
                  Enter the promo code that users will use
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <Select name="currency" defaultValue="IDR">
                  <SelectTrigger className="w-full">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IDR">IDR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="SGD">SGD</SelectItem>
                    <SelectItem value="MYR">MYR</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="discountType">Discount Type</FieldLabel>
                <Select
                  name="discountType"
                  defaultValue="fixed"
                  onValueChange={(value) => value && setDiscountType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {discountType === "fixed" ? (
                <Field>
                  <FieldLabel htmlFor="discountValue">Discount Value</FieldLabel>
                  <Input
                    id="discountValue"
                    type="number"
                    name="discountValue"
                    placeholder="10000"
                    min="0"
                    step="10000"
                  />
                </Field>
              ) : (
                <Field>
                  <FieldLabel htmlFor="discountValue">Discount Percentage</FieldLabel>
                  <Slider
                    name="discountValue"
                    max={100}
                    step={10}
                    className="w-full"
                  />
                  <FieldDescription>
                    Percentage off the ticket price
                  </FieldDescription>
                </Field>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="startDate">Start Date & Time</FieldLabel>
                  <CustomDatePicker name="startDate"/>
                  <FieldDescription>
                    When the promo becomes active
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="endDate">End Date & Time</FieldLabel>
                  <CustomDatePicker name="endDate"/>
                  <FieldDescription>
                    When the promo expires (optional)
                  </FieldDescription>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="isActive">Status</FieldLabel>
                <Select name="isActive" defaultValue="active">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Set whether the promo is currently active
                </FieldDescription>
              </Field>

            </FieldGroup>
          </div>
        </form>

        <SheetFooter>
          <Button type="submit" form="add-promo-form">
            {isPending ? <Spinner/> : null}
            Save
          </Button>
          <SheetClose render={<Button variant="outline">Close</Button>}/>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
