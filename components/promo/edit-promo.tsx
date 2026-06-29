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
import {Pencil} from "lucide-react";
import {PromoType, UpdatePromoType} from "@/db/schema";
import {ActionResponse, initialState} from "@/types/types";
import {updatePromo} from "@/app/actions/event-promo/promo.action";
import {Slider} from "@/components/ui/slider";
import {toast} from "sonner";

export function EditPromo({promo}: { promo: PromoType }) {
  const [open, setOpen] = useState(false);
  const [discountType, setDiscountType] = useState(promo.discountType)
  const [discountValue, setDiscountValue] = useState<number>(promo.discountValue);

  const [, formAction, isPending] = useActionState<ActionResponse, FormData>(
    async (_: ActionResponse, formData: FormData) => {

      const status = formData.get("status") as string == "true";
      const rawLimit = formData.get("usageLimit") as string
      const payload : UpdatePromoType = {
        id: promo.id,
        currency: formData.get("currency") as string,
        promo: formData.get("promo") as string,
        discountValue: Number(formData.get("discountValue") as string),
        discountType: formData.get("discountType") as string,
        isActive: status,
        usageLimit: rawLimit ? Number(rawLimit) : null,
      }

      const res =  await updatePromo(payload)
      toast.info(res.message)
      setOpen(!res.success)
      return res
    }, initialState)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost"><Pencil/></Button>}/>
      <SheetContent className="overflow-hidden sm:max-w-md">
        <SheetHeader className="shrink-0 pb-2">
          <SheetTitle>Edit Promo</SheetTitle>
          <SheetDescription>Update the promo code details.</SheetDescription>
        </SheetHeader>
        <form id="edit-promo-form" action={formAction} className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid auto-rows-min gap-4 px-4 pb-2">
            <FieldGroup className="gap-3">

              <Field className="gap-1.5">
                <FieldLabel htmlFor="promo">Promo Code</FieldLabel>
                <Input
                  id="promo"
                  type="text"
                  name="promo"
                  defaultValue={promo.promo}
                  placeholder="SAVE10"
                />
                <FieldDescription className="text-xs leading-snug">
                  Enter the promo code that users will use
                </FieldDescription>
              </Field>

              <div className="grid grid-cols-1 gap-3">
                <Field className="gap-1.5">
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

                <Field className="gap-1.5">
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
              </div>

              <div className="grid grid-cols-1 gap-3">
                {discountType === "fixed" ? (
                  <Field className="gap-1.5">
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
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="discountValue">Discount Percentage { discountValue }%</FieldLabel>
                    <Slider
                      name="discountValue"
                      max={100}
                      step={1}
                      value={[discountValue]}
                      onValueChange={(value: number | readonly number[]) => setDiscountValue(Array.isArray(value) ? value[0] : value)}
                      className="w-full"
                    />
                    <FieldDescription className="text-xs leading-snug">
                      Percentage off the ticket price
                    </FieldDescription>
                  </Field>
                )}

                <Field className="gap-1.5">
                  <FieldLabel htmlFor="usageLimit">Usage Limit</FieldLabel>
                  <Input
                    id="usageLimit"
                    type="number"
                    name="usageLimit"
                    defaultValue={promo.usageLimit ?? ""}
                    placeholder="Unlimited"
                    min="1"
                  />
                  <FieldDescription className="text-xs leading-snug">
                    {promo.usageLimit
                      ? `Used ${promo.usedCount} of ${promo.usageLimit}`
                      : `Used ${promo.usedCount} time(s), no limit set`
                    }
                  </FieldDescription>
                </Field>
              </div>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="isActive">Status</FieldLabel>
                <Select name="status" items={items} defaultValue={`${String(promo.isActive)}`}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription className="text-xs leading-snug">
                  Set whether the promo is currently active
                </FieldDescription>
              </Field>

            </FieldGroup>
          </div>
        </form>

        <SheetFooter className="shrink-0 border-t bg-popover">
          <Button type="submit" form="edit-promo-form" disabled={isPending}>
            Save changes
          </Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>}/>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const items = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
]
