"use client"

import * as React from "react"
import {type ReactNode, useActionState} from "react"
import {toast} from "sonner"

import {updateDashboardUserDetailAction} from "@/app/actions/dashboard-user/dashboard-user.action"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Spinner} from "@/components/ui/spinner"
import {Textarea} from "@/components/ui/textarea"
import {UserDetailType} from "@/db/schema"
import {ActionResponse, initialState} from "@/types/types"

function OptionalFieldLabel({htmlFor, children}: { htmlFor: string, children: ReactNode }) {
  return (
    <FieldLabel htmlFor={htmlFor}>
      {children}
      <span className="ml-1 text-xs font-normal text-muted-foreground">Optional</span>
    </FieldLabel>
  )
}

export function EditUserDetailForm({userId, detail}: { userId: string, detail: UserDetailType | null }) {
  const formId = React.useId()

  const [, formAction, isPending] = useActionState(
    async (_: ActionResponse<unknown, UserDetailType>, formData: FormData) => {
      const str = (key: string): string | null => {
        const val = String(formData.get(key) ?? "").trim()
        return val || null
      }

      const res = await updateDashboardUserDetailAction({
        userId,
        phoneNumber: str("phoneNumber"),
        clubName: str("clubName"),
        identityNumber: str("identityNumber"),
        nationality: str("nationality"),
        gender: str("gender"),
        bloodType: str("bloodType"),
        dateOfBirth: str("dateOfBirth"),
        emergencyContactName: str("emergencyContactName"),
        emergencyContactNumber: str("emergencyContactNumber"),
        countryOfResidence: str("countryOfResidence"),
        province: str("province"),
        city: str("city"),
        postalCode: str("postalCode"),
        address: str("address"),
        instagram: str("instagram"),
        strava: str("strava"),
      })

      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }

      return res
    },
    initialState as ActionResponse<unknown, UserDetailType>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit User Detail</CardTitle>
        <CardDescription>
          Manage rider profile, emergency contact, address, and social details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id={formId} action={formAction} className="space-y-8">
          <section className="space-y-5">
            <div>
              <h3 className="text-sm font-medium">Rider Information</h3>
              <p className="text-sm text-muted-foreground">
                Core participant details used for event registration.
              </p>
            </div>

            <FieldGroup>
              <div className="grid gap-5 md:grid-cols-2">
                <Field>
                  <OptionalFieldLabel htmlFor={`${formId}-phone-number`}>Phone</OptionalFieldLabel>
                  <Input
                    id={`${formId}-phone-number`}
                    name="phoneNumber"
                    type="text"
                    defaultValue={detail?.phoneNumber ?? ""}
                    placeholder="08212345678"
                  />
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor={`${formId}-club-name`}>Cycling Team / Club</OptionalFieldLabel>
                  <Input
                    id={`${formId}-club-name`}
                    name="clubName"
                    type="text"
                    defaultValue={detail?.clubName ?? ""}
                    placeholder="Barong Cycling"
                  />
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor={`${formId}-identity-number`}>KTP / Passport ID / ID Card</OptionalFieldLabel>
                  <Input
                    id={`${formId}-identity-number`}
                    name="identityNumber"
                    type="text"
                    defaultValue={detail?.identityNumber ?? ""}
                    placeholder="123023"
                  />
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor={`${formId}-nationality`}>Nationality</OptionalFieldLabel>
                  <Input
                    id={`${formId}-nationality`}
                    name="nationality"
                    type="text"
                    defaultValue={detail?.nationality ?? ""}
                    placeholder="Indonesian"
                  />
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor={`${formId}-gender`}>Gender</OptionalFieldLabel>
                  <Select
                    items={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                    ]}
                    name="gender" defaultValue={detail?.gender ?? ""}>
                    <SelectTrigger id={`${formId}-gender`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor={`${formId}-blood-type`}>Blood Type</OptionalFieldLabel>
                  <Select name="bloodType" defaultValue={detail?.bloodType ?? ""}>
                    <SelectTrigger id={`${formId}-blood-type`}>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor={`${formId}-date-of-birth`}>Date of Birth</OptionalFieldLabel>
                  <Input
                    id={`${formId}-date-of-birth`}
                    name="dateOfBirth"
                    type="date"
                    defaultValue={detail?.dateOfBirth ?? ""}
                  />
                </Field>
              </div>
            </FieldGroup>
          </section>

          <section className="space-y-5 border-t pt-8">
            <div>
              <h3 className="text-sm font-medium">Emergency Contact</h3>
              <p className="text-sm text-muted-foreground">
                Contact details staff can use for rider safety.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <OptionalFieldLabel htmlFor={`${formId}-emergency-contact-name`}>Emergency Contact Name</OptionalFieldLabel>
                <Input
                  id={`${formId}-emergency-contact-name`}
                  name="emergencyContactName"
                  type="text"
                  defaultValue={detail?.emergencyContactName ?? ""}
                  placeholder="Mira Tanaka"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor={`${formId}-emergency-contact-number`}>Emergency Contact Phone</OptionalFieldLabel>
                <Input
                  id={`${formId}-emergency-contact-number`}
                  name="emergencyContactNumber"
                  type="text"
                  defaultValue={detail?.emergencyContactNumber ?? ""}
                  placeholder="08212345678"
                />
              </Field>
            </div>
          </section>

          <section className="space-y-5 border-t pt-8">
            <div>
              <h3 className="text-sm font-medium">Address</h3>
              <p className="text-sm text-muted-foreground">
                Residence details for participant records.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <OptionalFieldLabel htmlFor={`${formId}-country-of-residence`}>Country of Residence</OptionalFieldLabel>
                <Input
                  id={`${formId}-country-of-residence`}
                  name="countryOfResidence"
                  type="text"
                  defaultValue={detail?.countryOfResidence ?? ""}
                  placeholder="Indonesia"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor={`${formId}-province`}>Province</OptionalFieldLabel>
                <Input
                  id={`${formId}-province`}
                  name="province"
                  type="text"
                  defaultValue={detail?.province ?? ""}
                  placeholder="Bali"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor={`${formId}-city`}>City</OptionalFieldLabel>
                <Input
                  id={`${formId}-city`}
                  name="city"
                  type="text"
                  defaultValue={detail?.city ?? ""}
                  placeholder="Denpasar"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor={`${formId}-postal-code`}>Postal Code</OptionalFieldLabel>
                <Input
                  id={`${formId}-postal-code`}
                  name="postalCode"
                  type="text"
                  defaultValue={detail?.postalCode ?? ""}
                  placeholder="12345"
                />
              </Field>

              <Field className="md:col-span-2">
                <OptionalFieldLabel htmlFor={`${formId}-address`}>Street Address</OptionalFieldLabel>
                <Textarea
                  id={`${formId}-address`}
                  name="address"
                  defaultValue={detail?.address ?? ""}
                  placeholder="Jln. Toko Sepeda No. 123"
                />
              </Field>
            </div>
          </section>

          <section className="space-y-5 border-t pt-8">
            <div>
              <h3 className="text-sm font-medium">Social Media</h3>
              <p className="text-sm text-muted-foreground">
                Optional public profile links associated with the rider.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <OptionalFieldLabel htmlFor={`${formId}-instagram`}>Instagram</OptionalFieldLabel>
                <Input
                  id={`${formId}-instagram`}
                  name="instagram"
                  type="text"
                  defaultValue={detail?.instagram ?? ""}
                  placeholder="https://www.instagram.com/yourname"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor={`${formId}-strava`}>Strava</OptionalFieldLabel>
                <Input
                  id={`${formId}-strava`}
                  name="strava"
                  type="text"
                  defaultValue={detail?.strava ?? ""}
                  placeholder="https://www.strava.com/athletes/1"
                />
                <FieldDescription>
                  Keep this empty when the rider has not shared a profile.
                </FieldDescription>
              </Field>
            </div>
          </section>
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="submit" form={formId} disabled={isPending}>
          {isPending ? <Spinner /> : null}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}
