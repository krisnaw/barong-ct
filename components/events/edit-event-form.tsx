'use client'

import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {CustomDatePicker} from "@/components/ui/custom-date-picker";
import {EventType} from "@/db/schema";

export function EditEventForm({event} : {event: EventType}) {
  // No wiring up logic as requested, just the UI structure

  return (
    <div className="flex flex-col gap-6">
      <form>
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
              defaultValue="This is an existing event description that can be edited."
            />
          </Field>


          <div className="flex gap-4">
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              {/* CustomDatePicker would need a value prop for editing */}
              <CustomDatePicker />
            </Field>

            <Field>
              <FieldLabel htmlFor="time">Time</FieldLabel>
              <Input
                type="time"
                id="time"
                step="1"
                defaultValue="14:00:00" // Example existing time
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
              defaultValue="Existing Meeting Location"
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
              defaultValue="https://maps.google.com/?q=Existing+Location"
              required
            />
          </Field>

          <Field>
            <Button type="submit">
              Save Changes
            </Button>
          </Field>

        </FieldGroup>
      </form>

    </div>
  )
}
