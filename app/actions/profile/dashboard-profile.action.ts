'use server'

import {z} from "zod";
import {user, userDetail, UserDetailInsertSchema, UserDetailType} from "@/db/schema";
import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {revalidatePath} from "next/cache";
import {eq} from "drizzle-orm";

export async function updateProfileFromDashAction(formData: UserDetailType & { name: string, image: string | null })
  : Promise<ActionResponse<UserDetailType & { name: string, image: string | null }>> {

  const validate = UserDetailInsertSchema.safeParse(formData);

  if (!validate.success) {
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(validate.error),
      fields: validate.data,
    }
  }

  try {
    await db.update(user).set({
      name: formData.name,
      image: formData.image,
    }).where(eq(user.id, validate.data.userId))

    validate.data.dateOfBirth = validate.data.dateOfBirth ? validate.data.dateOfBirth : null;

    console.log(validate.data);

    await db.insert(userDetail)
      .values(validate.data)
      .onConflictDoUpdate({
        target: userDetail.userId,
        set: validate.data,
      })

    revalidatePath("/", "page")

    return {
      success: true,
      message: 'Success, profile was updated',
      fields: validate.data,
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      console.log(error.message)
      return {
        success: false,
        message: error.message,
        fields: validate.data,
      }
    }
  }

  return {
    success: false,
    message: 'Sorry, something went wrong. Please try again later.',
    fields: validate.data
  }
}