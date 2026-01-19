'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import {db} from "@/db/db";
import {userDetail, UserDetailInsertSchema, UserDetailType} from "@/db/schema/user-detail-schema";
import {format} from "date-fns";
import {z} from "zod";

export type UserDetailData = z.infer<typeof UserDetailInsertSchema>;

export async function UpdateProfileAction(formData: UserDetailType & { name: string, image: string | null })
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
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: formData.name,
        image: formData.image,
      }
    })

    validate.data.dateOfBirth = validate.data.dateOfBirth ? format(new Date(validate.data.dateOfBirth), 'yyyy-MM-dd').toString() : null;

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