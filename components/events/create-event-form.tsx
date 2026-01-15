'use client'

import {useActionState, useState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {Textarea} from "@/components/ui/textarea";
import {CustomDatePicker} from "@/components/ui/custom-date-picker";
import {CreateEventAction} from "@/app/actions/event/event.action";
import {toast} from "sonner";
import {UploadButton} from "@/utils/uploadthing";

function combineDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`)
}


export function CreateEventForm() {
  const [image, setImage] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const startDate = new Date();

    const payload = {
      name: formData.get("name") as string,
      feature_image: image,
      description: formData.get("description") as string,
      startDate: startDate,
      locationName: formData.get("location") as string,
      locationLink: formData.get("map") as string,
    }

    const res = await CreateEventAction(payload)

    toast.info(res.message)

    return res
  }, initialState)


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
                required
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
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="map">Google Maps link for Direction</FieldLabel>
            <Input
              id="map"
              type="url"
              name="map"
              placeholder="https://share.google/jkQd7JmZJg808xIg4"
            />
          </Field>

          <Field>
            <Button type="submit" disabled={isPending} size="lg">
              {isPending ? <Spinner /> : null }
              Save
            </Button>
          </Field>

        </FieldGroup>
      </form>

    </div>
  )
}