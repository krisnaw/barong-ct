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
import {EventType} from "@/db/schema";
import {UpdateEventAction} from "@/app/actions/event/event.action";
import {format, parse} from "date-fns";
import {ContentEditor} from "@/components/events/content-editor";
import {fromZonedTime, toZonedTime} from "date-fns-tz";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UploadButton} from "@/utils/uploadthing";

export function EditEventForm({event} : {event: EventType}) {
  const regClosedAt = event.registrationClosesAt ? new Date(event.registrationClosesAt)  : new Date();
  const eventDate = new Date(event.startDate);
  const eventTime = toZonedTime(event.startDate, "Asia/Singapore")
  const [description, setDescription] = useState<string>(event.description);

  const [image, setImage] = useState<string | null>(event.feature_image ?? null);

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
      id: event.id,
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
      registrationClosesAt: new Date(formData.get("registrationClosesAt") as string),
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
              defaultValue={event.name}
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

          <Field>
            <FieldLabel htmlFor="price">Price</FieldLabel>
            <div className="flex gap-2">
              <Select defaultValue={event.currency ?? "idr"} name="currency">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="$" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.value}{" "}
                      <span className="text-muted-foreground">
                    {currency.label}
                  </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input defaultValue={event.price ?? ""} name="price" placeholder="1.000.000" pattern="[0-9]*" />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="service_fee">Service Fee</FieldLabel>
            <Input defaultValue={event.serviceFee ?? ""} name="service_fee" placeholder="5.000" pattern="[0-9]*" />
          </Field>

          <Field>
            <FieldLabel htmlFor="name">Registration Closed At</FieldLabel>
            <CustomDatePicker name="closedAt" value={regClosedAt} />
          </Field>

          <Field>
            <FieldLabel htmlFor="isGroupRide">
              Require Group Ride
            </FieldLabel>
            <Input
              type="number"
              id="isGroupRide"
              name="isGroupRide"
              defaultValue={event.isGroupRide ?? ""}
              placeholder="0"
            />
            <FieldDescription>
              Set a number to require participants to form a group ride.
            </FieldDescription>
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
                defaultValue={event.maxParticipants ?? 25}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="date">Event Date</FieldLabel>
              <CustomDatePicker value={eventDate} />
            </Field>

            <Field>
              <FieldLabel htmlFor="time">Time</FieldLabel>
              <Input
                required
                type="time"
                id="time"
                name="time"
                step="1"
                defaultValue={format(eventTime, "HH:mm:ss")}
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

const CURRENCIES = [
  {
    value: 'IDR', label: 'Rp',
  }
]
