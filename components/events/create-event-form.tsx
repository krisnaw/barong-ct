'use client'

import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {Textarea} from "@/components/ui/textarea";
import {CustomDatePicker} from "@/components/ui/custom-date-picker";
import {CreateEventAction} from "@/app/actions/event/event.action";
import {toast} from "sonner";

function combineDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`)
}


export function CreateEventForm() {
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const startDate = new Date();

    const payload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      startDate: startDate,
      location: formData.get("location") as string,
      map: formData.get("map") as string,
    }

    console.log(payload)

    const res = await CreateEventAction(payload)

    toast.info(res.message)

    return res
  }, initialState)


  return (
    <div className="flex flex-col gap-6">
      <form action={formAction}>
        <FieldGroup>

          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Barong X Anniversary"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Descriptions</FieldLabel>
            <Textarea name="description" id="description" required placeholder="Type your description here." />
          </Field>


          <div className="flex gap-4">
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <CustomDatePicker />
            </Field>

            <Field>
              <FieldLabel htmlFor="time">Time</FieldLabel>
              <Input
                type="time"
                id="time"
                step="1"
                defaultValue="10:30:00"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </Field>

          </div>

          <Field>
            <FieldLabel htmlFor="location">Meeting Location</FieldLabel>
            <Input
              id="location"
              type="text"
              name="location"
              placeholder="Lumintang Park"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="map">Google Maps link for Direction</FieldLabel>
            <Input
              id="map"
              type="url"
              name="map"
              placeholder="https://share.google/jkQd7JmZJg808xIg4"
              required
            />
          </Field>

          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : null }
              Save
            </Button>
          </Field>

        </FieldGroup>
      </form>

    </div>
  )
}