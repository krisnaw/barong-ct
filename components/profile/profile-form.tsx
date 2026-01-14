'use client'

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {UpdateProfileAction} from "@/app/actions/profile/profile.action";
import {User} from "better-auth";
import {toast} from "sonner";

export function ProfileForm({user}: {user: User}) {
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const payload = {
      full_name: formData.get("full_name") as string,
      // phone : formData.get("phone") as string,
      // date_of_birth: '',
      // emergency_contact_name: formData.get("emergency_contact_name") as string,
      // emergency_contact_number: formData.get("emergency_contact_number") as string,
    }

    console.log(payload);

    const res = await UpdateProfileAction(payload)

    if (!res.success) {
      toast.error(res.message)
    }

    toast.success(res.message)

    return res;

  }, initialState)
  return (
    <div className="flex flex-col gap-6">

      <form action={formAction}>
        <FieldGroup>

          <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldDescription>
              Update your full name for event registration and race-related features.
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="full_name">Full name</FieldLabel>
                <Input
                  id="full_name"
                  type="text"
                  name="full_name"
                  placeholder="Tadej Pogačar"
                  defaultValue={user.name}
                  required
                />
              </Field>

              {/*<Field>*/}
              {/*  <FieldLabel htmlFor="full_name">Date of birth</FieldLabel>*/}
              {/*  <CustomDatePicker />*/}
              {/*</Field>*/}

            </FieldGroup>


          </FieldSet>


          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Social Media</FieldLegend>
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Instagram</FieldLabel>
                <Input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="08212345678"
                  required
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="strava">Strava</FieldLabel>
                <Input
                  id="strava"
                  type="text"
                  name="strava"
                  placeholder="08212345678"
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Contact</FieldLegend>
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription>


            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="08212345678"
                  required
                />
              </Field>
            </FieldGroup>

          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Emergency Contact</FieldLegend>
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription>


            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="emergency_contact_name">Emergency Contact Name</FieldLabel>
                <Input
                  id="emergency_contact_name"
                  type="text"
                  name="emergency_contact_name"
                  placeholder="Mira Tanaka"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="emergency_contact_phone">Emergency Contact Phone</FieldLabel>
                <Input
                  id="emergency_contact_phone"
                  type="text"
                  name="emergency_contact_phone"
                  placeholder="08212345678"
                  required
                />
              </Field>


            </FieldGroup>

          </FieldSet>


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