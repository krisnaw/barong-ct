'use server'

import {revalidatePath} from "next/cache"
import {z} from "zod"
import {eq} from "drizzle-orm"

import {auth} from "@/lib/auth"
import {db} from "@/db/db"
import {user, userDetail, UserDetailInsertSchema, UserDetailType} from "@/db/schema"
import {ActionResponse} from "@/types/types"

const CreateDashboardUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("Enter a valid email address."),
})

type CreateDashboardUserFields = z.infer<typeof CreateDashboardUserSchema>

export async function createDashboardUserAction(
  formData: CreateDashboardUserFields
): Promise<ActionResponse<unknown, CreateDashboardUserFields>> {
  const validate = CreateDashboardUserSchema.safeParse(formData)

  if (!validate.success) {
    return {
      success: false,
      message: "Invalid user data.",
      error: z.flattenError(validate.error),
      fields: formData,
    }
  }

  try {
    await auth.api.createUser({
      body: {
        name: validate.data.name,
        email: validate.data.email,
      },
    })

  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to create user.",
      fields: validate.data,
    }
  }

  revalidatePath("/dashboard/users", "page")

  return {
    success: true,
    message: "User was created.",
  }
}

const UpdateDashboardUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("Enter a valid email address."),
})

type UpdateDashboardUserFields = z.infer<typeof UpdateDashboardUserSchema>

export async function updateDashboardUserAction(
  formData: UpdateDashboardUserFields
): Promise<ActionResponse<unknown, UpdateDashboardUserFields>> {
  const validate = UpdateDashboardUserSchema.safeParse(formData)

  if (!validate.success) {
    return {
      success: false,
      message: "Invalid user data.",
      error: z.flattenError(validate.error),
      fields: formData,
    }
  }

  try {
    await db.update(user).set({
      name: validate.data.name,
      email: validate.data.email,
    }).where(eq(user.id, validate.data.id))
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to update user.",
      fields: validate.data,
    }
  }

  revalidatePath(`/dashboard/users/${validate.data.id}/edit`, "page")
  revalidatePath("/dashboard/users", "page")

  return {
    success: true,
    message: "User account was updated.",
  }
}

export async function createDashboardUserDetailAction(
  formData: UserDetailType
): Promise<ActionResponse<unknown, UserDetailType>> {
  const validate = UserDetailInsertSchema.safeParse(formData)

  if (!validate.success) {
    return {
      success: false,
      message: "Invalid data.",
      error: z.flattenError(validate.error),
      fields: formData,
    }
  }

  const data: UserDetailType = {
    userId: validate.data.userId,
    phoneNumber: validate.data.phoneNumber ?? null,
    identityNumber: validate.data.identityNumber ?? null,
    nationality: validate.data.nationality ?? null,
    gender: validate.data.gender ?? null,
    bloodType: validate.data.bloodType ?? null,
    dateOfBirth: validate.data.dateOfBirth || null,
    clubName: validate.data.clubName ?? null,
    instagram: validate.data.instagram ?? null,
    strava: validate.data.strava ?? null,
    emergencyContactName: validate.data.emergencyContactName ?? null,
    emergencyContactNumber: validate.data.emergencyContactNumber ?? null,
    countryOfResidence: validate.data.countryOfResidence ?? null,
    province: validate.data.province ?? null,
    city: validate.data.city ?? null,
    postalCode: validate.data.postalCode ?? null,
    address: validate.data.address ?? null,
  }

  try {
    await db.insert(userDetail).values(data)
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to create user detail.",
      fields: data,
    }
  }

  revalidatePath(`/dashboard/users/${formData.userId}/edit`, "page")

  return {
    success: true,
    message: "User detail was created.",
  }
}

export async function updateDashboardUserDetailAction(
  formData: UserDetailType
): Promise<ActionResponse<unknown, UserDetailType>> {
  const validate = UserDetailInsertSchema.safeParse(formData)

  if (!validate.success) {
    return {
      success: false,
      message: "Invalid data.",
      error: z.flattenError(validate.error),
      fields: formData,
    }
  }

  const data: UserDetailType = {
    userId: validate.data.userId,
    phoneNumber: validate.data.phoneNumber ?? null,
    identityNumber: validate.data.identityNumber ?? null,
    nationality: validate.data.nationality ?? null,
    gender: validate.data.gender ?? null,
    bloodType: validate.data.bloodType ?? null,
    dateOfBirth: validate.data.dateOfBirth || null,
    clubName: validate.data.clubName ?? null,
    instagram: validate.data.instagram ?? null,
    strava: validate.data.strava ?? null,
    emergencyContactName: validate.data.emergencyContactName ?? null,
    emergencyContactNumber: validate.data.emergencyContactNumber ?? null,
    countryOfResidence: validate.data.countryOfResidence ?? null,
    province: validate.data.province ?? null,
    city: validate.data.city ?? null,
    postalCode: validate.data.postalCode ?? null,
    address: validate.data.address ?? null,
  }

  try {
    await db.insert(userDetail)
      .values(data)
      .onConflictDoUpdate({
        target: userDetail.userId,
        set: data,
      })
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to update user detail.",
      fields: data,
    }
  }

  revalidatePath(`/dashboard/users/${formData.userId}/edit`, "page")

  return {
    success: true,
    message: "User detail was updated.",
  }
}
