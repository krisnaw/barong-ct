'use client'

import * as React from "react";
import {useActionState, useState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {CustomDatePicker} from "@/components/ui/custom-date-picker";
import {toast} from "sonner";
import {UploadButton} from "@/utils/uploadthing";
import {createEventAction} from "@/app/actions/event/event.action";
import {ContentEditor} from "@/components/events/content-editor";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {parse} from "date-fns";
import {fromZonedTime} from "date-fns-tz";
import {useRouter} from "next/navigation";

export function CreateEventForm() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("")
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const inputDate = formData.get('date') as string
    const inputTime = formData.get('time') as string

    const localDate = parse(
      `${inputDate} ${inputTime}`,
      "M/d/yyyy HH:mm:ss",
      new Date()
    )

    const utcDate = fromZonedTime(localDate, "Asia/Singapore")

    const payload = {
      name: formData.get("name") as string,
      feature_image: image,
      description: description,
      startDate: utcDate,
      locationName: formData.get("location") as string,
      locationLink: formData.get("map") as string,
      maxParticipants: Number(formData.get("maxParticipants")),
      isGroupRide : Number(formData.get("isGroupRide")),
      price: Number(formData.get("price")),
      currency: formData.get("currency") as string,
      isPaid: !!Number(formData.get("price")),
      serviceFee: Number(formData.get("service_fee")),
      registrationClosesAt: new Date(formData.get("closedAt") as string),
    }

    const res = await createEventAction(payload)

    if (res.success) {
      router.push(`/dashboard/events/${res.data}`)
    }

    toast.info(res.message)

    return res

  }, initialState)


  return (
    <div className="flex flex-col gap-6">
      <form action={formAction}>
        <FieldGroup>

          <Field>
            <FieldLabel htmlFor="name">Banner image</FieldLabel>
            <div className="col-span-full flex flex-col sm:flex-row items-center gap-4">
              
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
            <ContentEditor
              content={description}
              onChange={(content: string) => setDescription(content)}
              editable={!isPending}
              placeholder="Enter description..."
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Field>
              <FieldLabel htmlFor="maxParticipants">Max Participants</FieldLabel>
              <Input
                id="maxParticipants"
                type="number"
                name="maxParticipants"
                placeholder="100"
                min="1"
                defaultValue="25"
              />
            </Field>

            
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
                name="time"
                step="1"
                defaultValue="05:30:00"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </Field>

          </div>

          <Field>
            <FieldLabel htmlFor="price">Price</FieldLabel>
            <div className="flex gap-2">
              <Select defaultValue="IDR" name="currency">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="$" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">
                    IDR
                    <span className="text-muted-foreground">
                        Rp
                  </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Input name="price" placeholder="1.000.000" pattern="[0-9]*" />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="service_fee">Service Fee</FieldLabel>
            <Input defaultValue={15000} name="service_fee" placeholder="5.000" pattern="[0-9]*" />
          </Field>

          <Field>
            <FieldLabel htmlFor="name">Registration Closed At</FieldLabel>
            <CustomDatePicker name="closedAt" />
          </Field>

          <Field>
            <FieldLabel htmlFor="isGroupRide">
              Require Group Ride
            </FieldLabel>
            <Input
              type="number"
              id="isGroupRide"
              name="isGroupRide"
              placeholder="0"
            />
            <FieldDescription>
              Set a number to require participants to form a group ride.
            </FieldDescription>
          </Field>

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

