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
import {toast} from "sonner";
import {UploadButton} from "@/utils/uploadthing";
import {UserWithDetail} from "@/types/auth-types";

export function ProfileForm({user}: {user: UserWithDetail}) {

  const [profileImage, setProfileImage] = useState<string | null>(user.image ?? null);
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const payload = {
      id: user.id,
      name: formData.get("full_name") as string,
      image: profileImage ?? null,
      phoneNumber : formData.get("phone_number") as string,
      dateOfBirth: '',
      emergencyContactName: formData.get("emergency_contact_name") as string,
      emergencyContactNumber: formData.get("emergency_contact_number") as string,
      instagram: formData.get("instagram") as string,
      strava: formData.get("strava") as string,
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
                        className="size-24 flex-none rounded-lg  object-cover outline -outline-offset-1 outline-white/10"
                      />
                    </>
                  ) : (
                    <>
                      <svg className="size-24 flex-none rounded-lg" width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="256" height="256" fill="#F3F4F6"/>
                        <path d="M128 128C152.301 128 172 108.301 172 84C172 59.6995 152.301 40 128 40C103.699 40 84 59.6995 84 84C84 108.301 103.699 128 128 128Z" fill="#9CA3AF"/>
                        <path d="M128 148C90.4446 148 60 178.445 60 216V224H196V216C196 178.445 165.555 148 128 148Z" fill="#9CA3AF"/>
                      </svg>
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
                  <FieldLabel htmlFor="phone_number">Phone</FieldLabel>
                  <Input
                    id="phone_number"
                    type="text"
                    name="phone_number"
                    placeholder="08212345678"
                    defaultValue={user.detail?.phoneNumber ?? ""}
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
                  defaultValue={user.detail?.emergencyContactName ?? ""}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="emergency_contact_number">Emergency Contact Phone</FieldLabel>
                <Input
                  id="emergency_contact_number"
                  type="text"
                  name="emergency_contact_number"
                  placeholder="08212345678"
                  defaultValue={user.detail?.emergencyContactNumber ?? ""}
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
                <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
                <Input
                  id="instagram"
                  type="text"
                  name="instagram"
                  placeholder="https://www.instagram.com/yourname"
                  defaultValue={user.detail?.instagram ?? ""}
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
                  placeholder="https://www.strava.com/athletes/1"
                  defaultValue={user.detail?.strava ?? ""}
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