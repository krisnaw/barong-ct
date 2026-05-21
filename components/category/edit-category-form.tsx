'use client'

import * as React from "react";
import {useActionState} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {ActionResponse, initialState} from "@/types/types";
import {updateCategoryAction} from "@/app/actions/event-category/event-category.action";
import {toast} from "sonner";
import {Spinner} from "@/components/ui/spinner";
import {useRouter} from "next/navigation";
import {EventCategoryType} from "@/db/schema";
import Link from "next/link";

export function EditCategoryForm({category}: { category: EventCategoryType }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(async (_: ActionResponse, formData: FormData) => {

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
    return res

  }, initialState)

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Category</CardTitle>
        </CardHeader>
        <CardContent>

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

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

              <Field>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  defaultValue="14500000"
                  placeholder="0.00"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <Select name="currency" defaultValue="IDR">
                  <SelectTrigger className="w-full">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fiat</SelectLabel>
                      <SelectItem value="IDR">IDR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="SGD">SGD</SelectItem>
                      <SelectItem value="MYR">MYR</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Crypto</SelectLabel>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="SOL">SOL</SelectItem>
                    </SelectGroup>
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
                  defaultValue="15000"
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
                  defaultValue="50"
                  placeholder="50"
                />
                <FieldDescription>
                  Leave empty for unlimited.
                </FieldDescription>
              </Field>

            </div>


          </FieldGroup>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" size="lg" variant={"secondary"}>
            <Link href={`/dashboard/events/${category.eventId}`}>
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={isPending} size="lg">
            {isPending ? <Spinner/> : null}
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
