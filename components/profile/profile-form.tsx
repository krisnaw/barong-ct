'use client'

import {Field, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {UpdateProfileAction} from "@/app/actions/profile/profile.action";

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const name = formData.get('fullname')
    
    const res = await UpdateProfileAction()

    return res;

  }, initialState)
  return (
    <div className="flex flex-col gap-6">

      <form action={formAction}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Full name</FieldLabel>
            <Input
              id="fullname"
              type="text"
              name="fullname"
              placeholder="Tadej Pogačar"
              required
            />
          </Field>

          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : null }
              Save change
            </Button>
          </Field>
        </FieldGroup>

      </form>
    </div>
  )
}