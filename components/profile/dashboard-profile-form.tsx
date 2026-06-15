'use client'

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {UserDetailData} from "@/app/actions/profile/profile.action";
import {toast} from "sonner";
import {UserWithDetail} from "@/types/auth-types";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {UserDetailType} from "@/db/schema";
import {updateProfileFromDashAction} from "@/app/actions/profile/dashboard-profile.action";
import {Card, CardContent, CardFooter} from "@/components/ui/card";

export function DashboardProfileForm({user}: { user: UserWithDetail }) {

  const [state, formAction, isPending] = useActionState(async (_: ActionResponse<UserDetailData & {
    name: string,
    image: string | null
  }>, formData: FormData) => {
    const payload: UserDetailType & { name: string, image: string | null } = {
      userId: user.id as string,
      name: formData.get("full_name") as string,
      image: user.image ?? null,
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
      clubName: formData.get("clubName") as string,
    }
    const res = await updateProfileFromDashAction(payload)

    if (res.success) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }

    return res;
  }, initialState) as [state: ActionResponse<UserDetailType & { name: string, image: string | null }, UserDetailType & {
    name: string,
    image: string | null
  }>, formAction: (formData: FormData) => void, isPending: boolean]

  return (
    <form action={formAction} className="mt-4">
      <Card>
        <CardContent className="space-y-12 **:data-[slot=input]:mt-2 **:data-[slot=select-trigger]:mt-2 **:data-[slot=textarea]:mt-2">
          <section className="border-b border-border pb-10">
            <h2 className="text-base/7 font-semibold text-foreground text-balance">Personal Information</h2>
            <p className="mt-1 text-sm/6 text-muted-foreground text-pretty">
              Basic rider details used for registration and dashboard records.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="full_name" className="block text-sm/6 font-medium text-foreground">
                  Full name
                </label>
                <Input
                  id="full_name"
                  type="text"
                  name="full_name"
                  placeholder="Tadej Pogacar"
                  defaultValue={state.fields?.name ?? user.name}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone_number" className="block text-sm/6 font-medium text-foreground">
                  Phone
                </label>
                <Input
                  id="phone_number"
                  type="text"
                  name="phone_number"
                  placeholder="08212345678"
                  defaultValue={state.fields?.phoneNumber ?? user.detail?.phoneNumber ?? ""}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="clubName" className="block text-sm/6 font-medium text-foreground">
                  Cycling Team / Club Name
                  <span className="ml-1 text-xs font-normal text-muted-foreground">Optional</span>
                </label>
                <Input
                  id="clubName"
                  type="text"
                  name="clubName"
                  placeholder="Barong Cycling"
                  defaultValue={state.fields?.clubName ?? user.detail?.clubName ?? ""}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="gender" className="block text-sm/6 font-medium text-foreground">
                  Gender
                </label>
                <Select defaultValue={state.fields?.gender ?? (user.detail?.gender ?? "")} name="gender" required>
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select gender"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="identity_number" className="block text-sm/6 font-medium text-foreground">
                  KTP / Passport ID / ID Card
                </label>
                <Input
                  id="identity_number"
                  type="text"
                  name="identity_number"
                  placeholder="123023"
                  defaultValue={state.fields?.identityNumber ?? user.detail?.identityNumber ?? ""}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="nationality" className="block text-sm/6 font-medium text-foreground">
                  Nationality
                </label>
                <Input
                  id="nationality"
                  type="text"
                  name="nationality"
                  placeholder="Indonesian"
                  defaultValue={state.fields?.nationality ?? user.detail?.nationality ?? ""}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="blood_type" className="block text-sm/6 font-medium text-foreground">
                  Blood Type
                </label>
                <Select defaultValue={state.fields?.bloodType ?? (user.detail?.bloodType ?? "")} name="blood_type" required>
                  <SelectTrigger id="blood_type" className="w-full">
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
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="date" className="block text-sm/6 font-medium text-foreground">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  defaultValue={state.fields?.dateOfBirth ? state.fields?.dateOfBirth : (user.detail?.dateOfBirth ?? "")}
                />
              </div>
            </div>
          </section>

          <section className="border-b border-border pb-10">
            <h2 className="text-base/7 font-semibold text-foreground text-balance">Emergency Contact</h2>
            <p className="mt-1 text-sm/6 text-muted-foreground text-pretty">
              Contact details used when staff need to reach someone for rider safety.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="emergency_contact_name" className="block text-sm/6 font-medium text-foreground">
                  Emergency Contact Name
                </label>
                <Input
                  id="emergency_contact_name"
                  type="text"
                  name="emergency_contact_name"
                  placeholder="Mira Tanaka"
                  defaultValue={state.fields?.emergencyContactName ?? user.detail?.emergencyContactName ?? ""}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="emergency_contact_number" className="block text-sm/6 font-medium text-foreground">
                  Emergency Contact Phone
                </label>
                <Input
                  id="emergency_contact_number"
                  type="text"
                  name="emergency_contact_number"
                  placeholder="08212345678"
                  defaultValue={state.fields?.emergencyContactNumber ?? user.detail?.emergencyContactNumber ?? ""}
                  required
                />
              </div>
            </div>
          </section>

          <section className="border-b border-border pb-10">
            <h2 className="text-base/7 font-semibold text-foreground text-balance">Address Information</h2>
            <p className="mt-1 text-sm/6 text-muted-foreground text-pretty">
              Residence details for participant records and event administration.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="country_of_residence" className="block text-sm/6 font-medium text-foreground">
                  Country of Residence
                </label>
                <Input
                  id="country_of_residence"
                  type="text"
                  name="country_of_residence"
                  placeholder="Indonesia"
                  defaultValue={state.fields?.countryOfResidence ?? user.detail?.countryOfResidence ?? ""}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="province" className="block text-sm/6 font-medium text-foreground">
                  Province
                </label>
                <Input
                  id="province"
                  type="text"
                  name="province"
                  placeholder="Bali"
                  defaultValue={state.fields?.province ?? user.detail?.province ?? ""}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="city" className="block text-sm/6 font-medium text-foreground">
                  City
                </label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Denpasar"
                  defaultValue={state.fields?.city ?? user.detail?.city ?? ""}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="postal_code" className="block text-sm/6 font-medium text-foreground">
                  Postal Code
                </label>
                <Input
                  id="postal_code"
                  type="text"
                  name="postal_code"
                  placeholder="12345"
                  defaultValue={state.fields?.postalCode ?? user.detail?.postalCode ?? ""}
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm/6 font-medium text-foreground">
                  Street Address
                </label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Jln. Toko Sepeda No. 123"
                  defaultValue={state.fields?.address ?? (user.detail?.address ?? "")}
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base/7 font-semibold text-foreground text-balance">Social Media</h2>
            <p className="mt-1 text-sm/6 text-muted-foreground text-pretty">
              Optional public profile links associated with the rider.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="instagram" className="block text-sm/6 font-medium text-foreground">
                  Instagram
                </label>
                <Input
                  id="instagram"
                  type="text"
                  name="instagram"
                  placeholder="https://www.instagram.com/yourname"
                  defaultValue={state.fields?.instagram ?? (user.detail?.instagram ?? "")}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="strava" className="block text-sm/6 font-medium text-foreground">
                  Strava
                </label>
                <Input
                  id="strava"
                  type="text"
                  name="strava"
                  placeholder="https://www.strava.com/athletes/1"
                  defaultValue={state.fields?.strava ?? (user.detail?.strava ?? "")}
                />
              </div>
            </div>
          </section>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="min-w-28 active:scale-[0.96] transition-transform duration-150 ease-out"
          >
            {isPending ? <Spinner/> : null}
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
