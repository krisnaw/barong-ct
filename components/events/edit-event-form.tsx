'use client'

import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {CustomDatePicker} from "@/components/ui/custom-date-picker";
import {EventType} from "@/db/schema";
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {Spinner} from "@/components/ui/spinner";
import {UpdateEventAction} from "@/app/actions/event/event.action";
import {toast} from "sonner";

export function EditEventForm({event} : {event: EventType}) {
  console.log(event);
  const eventDate = new Date(event.startDate);
  const eventTime = eventDate.toTimeString().split(' ')[0]; // Format to HH:mm:ss

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const payload = {
      id: event.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      locationName: formData.get("locationName") as string,
      locationLink: formData.get("locationLink") as string,
    }

    const res = await UpdateEventAction(payload)

    toast.info(res.message)

    return {
      success: false,
      message: "",

    }
  }, initialState);

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
              defaultValue={event.name}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Descriptions</FieldLabel>
            <Textarea
              name="description"
              id="description"
              required
              placeholder="Type your description here."
              defaultValue={event.description}
            />
          </Field>


          <div className="flex gap-4">
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <CustomDatePicker value={eventDate} />
            </Field>

            <Field>
              <FieldLabel htmlFor="time">Time</FieldLabel>
              <Input
                type="time"
                id="time"
                step="1"
                defaultValue={eventTime}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </Field>

          </div>

          <Field>
            <FieldLabel htmlFor="locationName">Meeting Location</FieldLabel>
            <Input
              id="locationName"
              type="text"
              name="locationName"
              placeholder="Lumintang Park"
              defaultValue={event.locationName ?? ""}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="locationLink">Google Maps link for Direction</FieldLabel>
            <Input
              id="locationLink"
              type="url"
              name="locationLink"
              placeholder="https://share.google/jkQd7JmZJg808xIg4"
              defaultValue={event.locationLink ?? ""}
            />
          </Field>

          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : null}
              Save Changes
            </Button>
          </Field>

        </FieldGroup>
      </form>

    </div>
  )
}

