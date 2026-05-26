'use client'

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
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
import {EventCategoryType} from "@/db/schema";
import * as React from "react";
import {useActionState, useState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {updateCategoryAction} from "@/app/actions/event-category/event-category.action";
import {toast} from "sonner";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Pencil} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";

export function EditCategory({category}: { category: EventCategoryType }) {
  const [open, setOpen] = useState(false)
  const [_, formAction, isPending] = useActionState(async (_: ActionResponse, formData: FormData) => {

    const payload = {
      id: category.id,
      eventId: category.eventId,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price") as string),
      currency: formData.get("currency") as string,
      service_fee: formData.get("service_fee") as string,
    }

    const res = await updateCategoryAction(payload)
    toast.info(res.message)
    setOpen(!res.success)
    return res
  }, initialState)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost"><Pencil /></Button>}/>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form action={formAction} id="edit-category-form">
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  defaultValue={category.name ?? ""}
                  placeholder="Early Bird"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={category.description ?? ""}
                  placeholder="Discounted early bird ticket for first 50 registrants"
                />
              </Field>


              <Field>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  step="1"
                  min="0"
                  defaultValue={category.price ?? "129000"}
                  placeholder="0.00"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <Select name="currency" defaultValue={category.currency}>
                  <SelectTrigger className="w-full">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IDR">IDR</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="serviceFee">Service Fee</FieldLabel>
                <Input
                  id="serviceFee"
                  type="number"
                  name="serviceFee"
                  step="0.01"
                  min="0"
                  defaultValue={category.serviceFee ?? 0}
                  placeholder="0"
                />
                <FieldDescription>
                  Platform service fee (defaults to 0).
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="maxParticipants">Max Participants</FieldLabel>
                <Input
                  id="maxParticipants"
                  type="number"
                  name="maxParticipants"
                  min="1"
                  defaultValue={category.maxParticipants ?? 50}
                  placeholder="50"
                />
                <FieldDescription>
                  Leave empty for unlimited.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
        </form>
        <SheetFooter>
          <Button type="submit" form="edit-category-form" disabled={isPending}>
            {isPending ? <Spinner/> : null}
            Save changes
          </Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>}/>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
