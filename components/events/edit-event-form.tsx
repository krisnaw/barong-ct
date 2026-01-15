'use client'

import {useActionState, useState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {Textarea} from "@/components/ui/textarea";
import {CustomDatePicker} from "@/components/ui/custom-date-picker";
import {toast} from "sonner";
import {UploadButton} from "@/utils/uploadthing";

export function EditEventForm({event} : {event: EventType}) {
  console.log(event);
  const eventDate = new Date(event.startDate);
  const eventTime = eventDate.toTimeString().split(' ')[0]; // Format to HH:mm:ss

  const [image, setImage] = useState<string | null>(event.featureImage ?? null);

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
            <FieldLabel htmlFor="name">Banner image</FieldLabel>
            <div className="col-span-full flex items-center gap-x-8">

              <div>
                {image ? (
                  <>
                    <img
                      alt=""
                      src={image}
                      className="size-80 aspect-square flex-none rounded-lg  object-cover outline -outline-offset-1 outline-white/10"
                    />
                  </>
                  ) : (
                  <img

                    className="size-80 aspect-square flex-none rounded-lg object-cover outline -outline-offset-1 outline-white/10"

                    src="https://placeholdit.com/400x400/f3f4f6/9da8bf?text=Banner" alt=""/>
                )}

              </div>

              <div>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setImage(res[0].appUrl);
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    toast.error(`ERROR! ${error.message}`);
                  }}
                />
              </div>

            </div>
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
              <CustomDatePicker name="date" value={eventDate} />
            </Field>

            <Field>
              <FieldLabel htmlFor="time">Time</FieldLabel>
              <Input
                required
                type="time"
                id="time"
                name="time"
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
              name="location"
              placeholder="Lumintang Park"
              defaultValue={event.locationName ?? ""}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="locationLink">Google Maps link for Direction</FieldLabel>
            <Input
              id="locationLink"
              type="url"
              name="map"
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

