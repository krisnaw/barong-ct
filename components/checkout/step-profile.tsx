'use client'

import {UserWithDetail} from "@/types/auth-types";
import {Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {EventOrderType, UserDetailType} from "@/db/schema";
import {UpdateProfileAction} from "@/app/actions/profile/profile.action";
import {toast} from "sonner";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {updateOrderAction} from "@/app/actions/event-order/event-order.action";

export function StepProfile({user, order}: { user: UserWithDetail, order: EventOrderType }) {

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (_: ActionResponse, formData: FormData) => {

    const payload: UserDetailType & { name: string, image: string | null } = {
      userId: user.id as string,
      name: formData.get("full_name") as string,
      image: null,
      phoneNumber: formData.get("phone_number") as string,
      dateOfBirth: formData.get('date') as string,
      emergencyContactName: formData.get("emergency_contact_name") as string,
      emergencyContactNumber: formData.get("emergency_contact_number") as string,
      instagram: formData.get("instagram") as string,
      strava: formData.get("strava") as string,
      identityNumber: formData.get("identity_number") as string,
      nationality: formData.get("nationality") as string,
      gender: formData.get("gender") as string,
      bloodType: formData.get("blood_type") as string,
      countryOfResidence: formData.get("country_of_residence") as string,
      province: formData.get("province") as string,
      city: formData.get("city") as string,
      postalCode: formData.get("postal_code") as string,
      address: formData.get("address") as string,
      clubName: "",
    }

    const res = await UpdateProfileAction(payload)

    if (res.success) {
      // update order status
      const orderPayload = {
        ...order,          // copy
        status: "profile",  // modify ONE field
      };
      await updateOrderAction(orderPayload)

      toast.success(res.message)
      router.push(`/event/${eventId}/payment?${searchParams.toString()}`)
    } else {
      toast.error(res.message)
    }

    return res
  }, initialState) as [state: ActionResponse<UserDetailType & { name: string, image: string | null }, UserDetailType & {
    name: string,
    image: string | null
  }>, formAction: (formData: FormData) => void, isPending: boolean]

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>
            Complete Profile
          </CardTitle>
          <CardDescription>
            Please complete your profile to continue. 
          </CardDescription>
        </CardHeader>
        <CardContent>

          <FieldGroup>

            <FieldSet>
              <FieldLegend>Personal Information</FieldLegend>

              <FieldGroup>
                <Field>

                  <FieldLabel htmlFor="full_name">Full name</FieldLabel>

                  <Input
                    id="full_name"
                    type="text"
                    name="full_name"
                    placeholder="Tadej Pogačar"
                    defaultValue={state.fields?.name ?? user.name}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone_number">Phone</FieldLabel>
                  <Input
                    id="phone_number"
                    type="text"
                    name="phone_number"
                    placeholder="08212345678"
                    defaultValue={state.fields?.phoneNumber ?? user.detail?.phoneNumber ?? ""}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <Select defaultValue={user.detail?.gender ?? ""} name="gender" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="identity_number">KTP / Passport ID / ID Card</FieldLabel>
                  <Input
                    id="identity_number"
                    type="text"
                    name="identity_number"
                    placeholder="123023"
                    defaultValue={state.fields?.identityNumber ?? user.detail?.identityNumber ?? ""}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                  <Input
                    id="nationality"
                    type="text"
                    name="nationality"
                    placeholder="Indonesian"
                    defaultValue={state.fields?.nationality ?? user.detail?.nationality ?? "Indonesia"}
                    required
                  />
                </Field>


                <Field>
                  <FieldLabel htmlFor="blood_type">Blood Type</FieldLabel>
                  <Select defaultValue={state.fields?.bloodType ?? (user.detail?.bloodType ?? "")} name="blood_type"
                          required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type"/>
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
                  <FieldLabel htmlFor="date_of_birth">Date of Birth</FieldLabel>
                  <Input type="date" id="date" name="date"
                         defaultValue={state.fields?.dateOfBirth ? state.fields?.dateOfBirth : (user.detail?.dateOfBirth ?? "")}
                  />
                </Field>


              </FieldGroup>


            </FieldSet>

            <FieldSeparator/>

            <FieldSet>
              <FieldLegend>Emergency Contact</FieldLegend>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="emergency_contact_name">Emergency Contact Name</FieldLabel>
                  <Input
                    id="emergency_contact_name"
                    type="text"
                    name="emergency_contact_name"
                    placeholder="Mira Tanaka"
                    defaultValue={state.fields?.emergencyContactName ?? user.detail?.emergencyContactName ?? ""}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="emergency_contact_number">Emergency Contact Phone</FieldLabel>
                  <Input
                    id="emergency_contact_number"
                    type="text"
                    name="emergency_contact_number"
                    placeholder="08212345678"
                    defaultValue={state.fields?.emergencyContactNumber ?? user.detail?.emergencyContactNumber ?? ""}
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator/>

            <FieldSet>
              <FieldLegend>Address Information</FieldLegend>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="country_of_residence">Country of Residence</FieldLabel>
                  <Input
                    id="country_of_residence"
                    type="text"
                    name="country_of_residence"
                    placeholder="Indonesia"
                    defaultValue={state.fields?.countryOfResidence ?? user.detail?.countryOfResidence ?? ""}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="province">Province</FieldLabel>
                  <Input
                    id="province"
                    type="text"
                    name="province"
                    placeholder="Bali"
                    defaultValue={state.fields?.province ?? user.detail?.province ?? ""}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Denpasar"
                    defaultValue={state.fields?.city ?? user.detail?.city ?? ""}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="postal_code">Postal Code</FieldLabel>
                  <Input
                    id="postal_code"
                    type="text"
                    name="postal_code"
                    placeholder="12345"
                    defaultValue={state.fields?.postalCode ?? user.detail?.postalCode ?? ""}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="address">Street Address</FieldLabel>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Jln. Toko Sepeda No. 123"
                    defaultValue={state.fields?.address ?? (user.detail?.address ?? "")}
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isPending}>Continue</Button>
        </CardFooter>
      </Card>
    </form>
  )
}