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
import {UserWithDetail} from "@/types/auth-types";

export function UserDetail({user}: {user: UserWithDetail}) {

  return (
    <div className="flex flex-col gap-6">

      <FieldGroup>

        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>
            This is the user's profile information.
          </FieldDescription>

          <FieldGroup>

            <Field>
              <FieldLabel>Profile picture</FieldLabel>

              <div className="col-span-full flex items-center gap-x-8">
                {user.image ? (
                  <>
                    <img
                      alt=""
                      src={user.image}
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
              </div>
            </Field>

            <Field>
              <FieldLabel>Full name</FieldLabel>
              <div className="text-lg font-semibold">{user.name}</div>
            </Field>

            <FieldGroup>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <div className="text-lg">{user.detail?.phoneNumber ?? "-"}</div>
              </Field>
            </FieldGroup>

          </FieldGroup>

        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Emergency Contact</FieldLegend>
          <FieldDescription>
            This is the user's emergency contact information.
          </FieldDescription>

          <FieldGroup>

            <Field>
              <FieldLabel>Emergency Contact Name</FieldLabel>
              <div className="text-lg">{user.detail?.emergencyContactName ?? "-"}</div>
            </Field>

            <Field>
              <FieldLabel>Emergency Contact Phone</FieldLabel>
              <div className="text-lg">{user.detail?.emergencyContactNumber ?? "-"}</div>
            </Field>

          </FieldGroup>

        </FieldSet>

        <FieldSeparator />

        <FieldSet>

          <FieldLegend>Social Media</FieldLegend>

          <FieldDescription>
            This is the user's social media information.
          </FieldDescription>

          <FieldGroup>
            <Field>
              <FieldLabel>Instagram</FieldLabel>
              <div className="text-lg">{user.detail?.instagram ?? "-"}</div>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Strava</FieldLabel>
              <div className="text-lg">{user.detail?.strava ?? "-"}</div>
            </Field>
          </FieldGroup>
        </FieldSet>

      </FieldGroup>
    </div>
  )
}