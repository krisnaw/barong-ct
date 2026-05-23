'use client'

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
import {Pencil} from "lucide-react";
import {PromoType, UpdatePromoType} from "@/db/schema";
import {ActionResponse, initialState} from "@/types/types";
import {updatePromo} from "@/app/actions/profile/promo/promo.action";
import {Slider} from "@/components/ui/slider";
import {toast} from "sonner";

export function EditPromo({promo}: { promo: PromoType }) {
  const [open, setOpen] = useState(false);
  const [discountType, setDiscountType] = useState(promo.discountType)

  const [_, formAction, isPending] = useActionState<ActionResponse, FormData>(
    async (_: ActionResponse, formData: FormData) => {

      const payload : UpdatePromoType = {
        id: promo.id,
        startsAt: new Date(`${formData.get("startsAt") as string}`),
        endsAt: new Date(`${formData.get("endDate") as string}`),
        currency: formData.get("currency") as string,
        promo: formData.get("promo") as string,
        discountValue: Number(formData.get("discountValue") as string),
        discountType: formData.get("discountType") as string,
        isActive: true,
      }

      const res =  await updatePromo(payload)
      toast.info(res.message)
      setOpen(!res.success)
      return res
    }, initialState)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost"><Pencil/></Button>}/>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Promo</SheetTitle>
          <SheetDescription>Update the promo code details.</SheetDescription>
        </SheetHeader>
        <form id="edit-promo-form" action={formAction}>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="promo">Promo Code</FieldLabel>
                <Input
                  id="promo"
                  type="text"
                  name="promo"
                  defaultValue={promo.promo}
                  placeholder="SAVE10"
                />
                <FieldDescription>
                  Enter the promo code that users will use
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <Select name="currency" defaultValue={promo.currency ?? "IDR"}>
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
                  defaultValue={promo.discountType}
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
                    defaultValue={promo.discountValue}
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
                    defaultValue={promo.discountValue}
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
                  <CustomDatePicker name="startDate" value={promo.startsAt ? new Date(promo.startsAt) : new Date()}/>
                  <FieldDescription>
                    When the promo becomes active
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="endDate">End Date & Time</FieldLabel>
                  <CustomDatePicker name="endDate" value={promo.endsAt ? new Date(promo.endsAt) : new Date()}/>
                  <FieldDescription>
                    When the promo expires (optional)
                  </FieldDescription>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="isActive">Status</FieldLabel>
                <Select name="isActive" defaultValue={promo.isActive ? "active" : "inactive"}>
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
          <Button type="submit" form="edit-promo-form" disabled={isPending}>
            Save changes
          </Button>
          <SheetClose render={<Button variant="outline">Close</Button>}/>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
