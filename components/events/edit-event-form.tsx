'use client'

import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {Textarea} from "@/components/ui/textarea";
import {CreateEventAction} from "@/app/actions/event/event.action";
import {toast} from "sonner";

export function CreateEventForm() {
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const payload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    }

    const res = await CreateEventAction(payload)

    toast.success(res.message)

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