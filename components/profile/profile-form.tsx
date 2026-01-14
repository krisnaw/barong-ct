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
import {useActionState, useState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {UpdateProfileAction} from "@/app/actions/profile/profile.action";
import {User} from "better-auth";
import {toast} from "sonner";
import {UploadButton} from "@/utils/uploadthing";

export function ProfileForm({user}: {user: User}) {
  const [profileImage, setProfileImage] = useState<string | null>(user.image ?? null);
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const payload = {
      name: formData.get("full_name") as string,
      image: profileImage ?? null,
      // phone : formData.get("phone") as string,
      // date_of_birth: '',
      // emergency_contact_name: formData.get("emergency_contact_name") as string,
      // emergency_contact_number: formData.get("emergency_contact_number") as string,
    }

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
                <FieldLabel htmlFor="full_name">Profile picture</FieldLabel>

                <div className="col-span-full flex items-center gap-x-8">
                  {profileImage ? (
                    <>
                      <img
                        alt=""
                        src={profileImage}
                        className="size-24 flex-none rounded-lg bg-gray-800 object-cover outline -outline-offset-1 outline-white/10"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-24 flex-none rounded-lg bg-gray-800 object-cover outline -outline-offset-1 outline-white/10"
                      />
                    </>
                  )}

                  <div>

                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        setProfileImage(res[0].appUrl);
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

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Phone</FieldLabel>
                  <Input
                    id="phone"
                    type="text"
                    name="phone"
                    placeholder="08212345678"
                  />
                </Field>
              </FieldGroup>

              {/*<Field>*/}
              {/*  <FieldLabel htmlFor="full_name">Date of birth</FieldLabel>*/}
              {/*  <CustomDatePicker />*/}
              {/*</Field>*/}

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

                />
              </Field>

              <Field>
                <FieldLabel htmlFor="emergency_contact_phone">Emergency Contact Phone</FieldLabel>
                <Input
                  id="emergency_contact_phone"
                  type="text"
                  name="emergency_contact_phone"
                  placeholder="08212345678"

                />
              </Field>


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