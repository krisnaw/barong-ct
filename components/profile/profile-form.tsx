'use client'

import {Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet,} from "@/components/ui/field"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {useActionState, useState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {UpdateProfileAction} from "@/app/actions/profile/profile.action";
import {toast} from "sonner";
import {UploadButton} from "@/utils/uploadthing";
import {UserWithDetail} from "@/types/auth-types";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {CalendarViewPicker} from "@/components/ui/calendar-view-picker";

export function ProfileForm({user}: { user: UserWithDetail }) {

  const [profileImage, setProfileImage] = useState<string | null>(user.image ?? null);
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const payload = {
      id: user.id,
      name: formData.get("full_name") as string,
      image: profileImage ?? null,
      phoneNumber: formData.get("phone_number") as string,
      dateOfBirth: formData.get("date") as string,
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
      clubName: formData.get("clubName") as string,
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
            <FieldLegend>Personal Information</FieldLegend>

            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="full_name">Profile picture</FieldLabel>

                <div className="col-span-full flex items-center gap-x-8">
                  {profileImage ? (
                    <>
                      <img
                        alt={user.name}
                        src={profileImage}
                        className="size-24 flex-none rounded-lg  object-cover outline -outline-offset-1 outline-white/10"
                      />
                    </>
                  ) : (
                    <>
                      <svg className="size-24 flex-none rounded-lg" width="256" height="256" viewBox="0 0 256 256"
                           fill="none" xmlns="http://www.w3.org/2000/svg">
                        <title>Default avatar placeholder</title>
                        <rect width="256" height="256" fill="#F3F4F6"/>
                        <path
                          d="M128 128C152.301 128 172 108.301 172 84C172 59.6995 152.301 40 128 40C103.699 40 84 59.6995 84 84C84 108.301 103.699 128 128 128Z"
                          fill="#9CA3AF"/>
                        <path d="M128 148C90.4446 148 60 178.445 60 216V224H196V216C196 178.445 165.555 148 128 148Z"
                              fill="#9CA3AF"/>
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


              <div className="grid gap-4 md:grid-cols-2">

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

                <Field>
                  <FieldLabel htmlFor="clubName">Cycling Team/Club Name</FieldLabel>
                  <Input
                    id="clubName"
                    type="text"
                    name="clubName"
                    placeholder="Barong Cycling"
                    defaultValue={user.detail?.clubName ?? ""}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <Select defaultValue={user.detail?.gender ?? ""} name="gender">
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>


                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="identity_number">KTP / Passport ID / ID Card</FieldLabel>
                    <Input
                      id="identity_number"
                      type="text"
                      name="identity_number"
                      placeholder="123023"
                      defaultValue={user.detail?.identityNumber ?? ""}
                    />
                  </Field>
                </FieldGroup>

                <Field>
                  <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                  <Input
                    id="nationality"
                    type="text"
                    name="nationality"
                    placeholder="Indonesian"
                    defaultValue={user.detail?.nationality ?? ""}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="blood_type">Blood Type</FieldLabel>
                  <Select defaultValue={user.detail?.bloodType ?? ""} name="blood_type" >
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
                  <div className="h-[300px]">
                    <CalendarViewPicker defaultValue={user.detail?.dateOfBirth ?? undefined} />
                  </div>

                  {/*<CustomDatePicker value={user.detail?.dateOfBirth ? new Date(user.detail?.dateOfBirth) : undefined}/>*/}
                </Field>


              </div>

            </FieldGroup>

          </FieldSet>

          <FieldSeparator/>

          <FieldSet>
            <FieldLegend>Emergency Contact</FieldLegend>

            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
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
              </div>
            </FieldGroup>

          </FieldSet>

          <FieldSeparator/>

          <FieldSet>
            <FieldLegend>Address Information</FieldLegend>

            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="country_of_residence">Country of Residence</FieldLabel>
                  <Input
                    id="country_of_residence"
                    type="text"
                    name="country_of_residence"
                    placeholder="Indonesia"
                    defaultValue={user.detail?.countryOfResidence ?? ""}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="province">Province</FieldLabel>
                  <Input
                    id="province"
                    type="text"
                    name="province"
                    placeholder="DKI Jakarta"
                    defaultValue={user.detail?.province ?? ""}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Jakarta"
                    defaultValue={user.detail?.city ?? ""}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="postal_code">Postal Code</FieldLabel>
                  <Input
                    id="postal_code"
                    type="text"
                    name="postal_code"
                    placeholder="12345"
                    defaultValue={user.detail?.postalCode ?? ""}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="address">Street Address</FieldLabel>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Jln. Toko Sepeda No. 123"
                  defaultValue={user.detail?.address ?? ""}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator/>

          <FieldSet>

            <FieldLegend>Social Media</FieldLegend>

            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
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
              </div>
            </FieldGroup>
          </FieldSet>

          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner/> : null}
              Save change
            </Button>
          </Field>
        </FieldGroup>

      </form>
    </div>
  )
}