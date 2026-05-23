'use client'
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
import {useRouter} from "next/navigation";
import * as React from "react";
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {createCategoryAction} from "@/app/actions/event-category/event-category.action";
import {toast} from "sonner";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Spinner} from "@/components/ui/spinner";

export function AddCategory({eventId}: { eventId: number }) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(async (_: ActionResponse, formData: FormData) => {

    const payload = {
      eventId: Number(eventId),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price") as string),
      currency: formData.get("currency") as string,
      service_fee: formData.get("service_fee") as string,
    }

    const res = await createCategoryAction(payload)
    if (res.success) {
      router.push(`/dashboard/events/${eventId}`)
    }

    toast.info(res.message)

    return res

  }, initialState)

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Add Category</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        <form id="create-category-form" action={formAction}>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Long"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="150KM"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 gap-4">

                <Field>
                  <FieldLabel htmlFor="price">Price</FieldLabel>
                  <Input
                    id="price"
                    type="number"
                    name="price"
                    step="10000"
                    min="0"
                    placeholder="1450000"
                  />
                  <FieldDescription>
                    Category price (set to 0 for free event).
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
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="serviceFee">Service Fee</FieldLabel>
                  <Input
                    id="serviceFee"
                    type="number"
                    name="serviceFee"
                    step="5000"
                    min="0"
                    placeholder="15000"
                  />
                  <FieldDescription>
                    Service fee (set to 0 for free event).
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="maxParticipants">Max Participants</FieldLabel>
                  <Input
                    id="maxParticipants"
                    type="number"
                    name="maxParticipants"
                    min="1"
                    defaultValue="50"
                    placeholder="50"
                  />
                </Field>
              </div>
            </FieldGroup>
          </div>
        </form>

        <SheetFooter>
          <Button type="submit" form="create-category-form" disabled={isPending}>
            {isPending ? <Spinner/> : null}
            Save
          </Button>
          <SheetClose render={<Button variant="outline">Close</Button>}/>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}