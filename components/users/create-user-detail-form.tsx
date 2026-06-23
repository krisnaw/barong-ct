"use client"

import {type ReactNode, useActionState} from "react"
import {useRouter} from "next/navigation"
import {toast} from "sonner"

import {createDashboardUserDetailAction} from "@/app/actions/dashboard-user/dashboard-user.action"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Spinner} from "@/components/ui/spinner"
import {Textarea} from "@/components/ui/textarea"
import {UserDetailType, UserType} from "@/db/schema"
import {ActionResponse, initialState} from "@/types/types"

function OptionalFieldLabel({htmlFor, children}: { htmlFor: string, children: ReactNode }) {
  return (
    <FieldLabel htmlFor={htmlFor}>
      {children}
      <span className="ml-1 text-xs font-normal text-muted-foreground">Optional</span>
    </FieldLabel>
  )
}

export function CreateUserDetailForm({user}: { user: UserType }) {
  const router = useRouter()
  const formId = "create-user-detail-form"

  const [, formAction, isPending] = useActionState(
    async (_: ActionResponse<unknown, UserDetailType>, formData: FormData) => {
      const str = (key: string): string | null => {
        const val = String(formData.get(key) ?? "").trim()
        return val || null
      }

      const res = await createDashboardUserDetailAction({
        userId: user.id,
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
        router.refresh()
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
        <CardTitle>Create User Detail</CardTitle>
        <CardDescription>
          Add rider profile, emergency contact, address, and social details.
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
                  <OptionalFieldLabel htmlFor="create-detail-phone-number">Phone</OptionalFieldLabel>
                  <Input
                    id="create-detail-phone-number"
                    name="phoneNumber"
                    type="text"
                    placeholder="08212345678"
                  />
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor="create-detail-club-name">Cycling Team / Club</OptionalFieldLabel>
                  <Input
                    id="create-detail-club-name"
                    name="clubName"
                    type="text"
                    placeholder="Barong Cycling"
                  />
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor="create-detail-identity-number">KTP / Passport ID / ID Card</OptionalFieldLabel>
                  <Input
                    id="create-detail-identity-number"
                    name="identityNumber"
                    type="text"
                    placeholder="123023"
                  />
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor="create-detail-nationality">Nationality</OptionalFieldLabel>
                  <Input
                    id="create-detail-nationality"
                    name="nationality"
                    type="text"
                    placeholder="Indonesian"
                  />
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor="create-detail-gender">Gender</OptionalFieldLabel>
                  <Select name="gender" items={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}>
                    <SelectTrigger id="create-detail-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <OptionalFieldLabel htmlFor="create-detail-blood-type">Blood Type</OptionalFieldLabel>
                  <Select name="bloodType">
                    <SelectTrigger id="create-detail-blood-type">
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
                  <OptionalFieldLabel htmlFor="create-detail-date-of-birth">Date of Birth</OptionalFieldLabel>
                  <Input
                    id="create-detail-date-of-birth"
                    name="dateOfBirth"
                    type="date"
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
                <OptionalFieldLabel htmlFor="create-detail-emergency-contact-name">Emergency Contact Name</OptionalFieldLabel>
                <Input
                  id="create-detail-emergency-contact-name"
                  name="emergencyContactName"
                  type="text"
                  placeholder="Mira Tanaka"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor="create-detail-emergency-contact-number">Emergency Contact Phone</OptionalFieldLabel>
                <Input
                  id="create-detail-emergency-contact-number"
                  name="emergencyContactNumber"
                  type="text"
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
                <OptionalFieldLabel htmlFor="create-detail-country-of-residence">Country of Residence</OptionalFieldLabel>
                <Input
                  id="create-detail-country-of-residence"
                  name="countryOfResidence"
                  type="text"
                  placeholder="Indonesia"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor="create-detail-province">Province</OptionalFieldLabel>
                <Input
                  id="create-detail-province"
                  name="province"
                  type="text"
                  placeholder="Bali"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor="create-detail-city">City</OptionalFieldLabel>
                <Input
                  id="create-detail-city"
                  name="city"
                  type="text"
                  placeholder="Denpasar"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor="create-detail-postal-code">Postal Code</OptionalFieldLabel>
                <Input
                  id="create-detail-postal-code"
                  name="postalCode"
                  type="text"
                  placeholder="12345"
                />
              </Field>

              <Field className="md:col-span-2">
                <OptionalFieldLabel htmlFor="create-detail-address">Street Address</OptionalFieldLabel>
                <Textarea
                  id="create-detail-address"
                  name="address"
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
                <OptionalFieldLabel htmlFor="create-detail-instagram">Instagram</OptionalFieldLabel>
                <Input
                  id="create-detail-instagram"
                  name="instagram"
                  type="text"
                  placeholder="https://www.instagram.com/yourname"
                />
              </Field>

              <Field>
                <OptionalFieldLabel htmlFor="create-detail-strava">Strava</OptionalFieldLabel>
                <Input
                  id="create-detail-strava"
                  name="strava"
                  type="text"
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
          Create Detail
        </Button>
      </CardFooter>
    </Card>
  )
}