'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import {db} from "@/db/db";
import {userDetail, UserDetailInsertSchema, UserDetailType} from "@/db/schema/user-detail-schema";
import {format} from "date-fns";
import {z} from "zod";

export async function UpdateProfileAction(payload: UserDetailType & { name: string, image: string | null}): Promise<ActionResponse> {

  const validate = UserDetailInsertSchema.safeParse(payload);

  if (!validate.success) {
    console.log(z.flattenError(validate.error))
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
        name: payload.name,
        image: payload.image,
      }
    })

    payload.dateOfBirth = payload.dateOfBirth ? format(new Date(payload.dateOfBirth), 'yyyy-MM-dd').toString() : null;

    console.log(payload)

    await db.insert(userDetail)
      .values(payload)
      .onConflictDoUpdate({
        target: userDetail.userId,
        set: payload
      })

    revalidatePath("/", "page")

    return {
      success: true,
      message: 'Success, profile was updated'
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      return {
        success: false,
        message: error.message,
        fields: payload
      }
    }
  }

  return {
    success: false,
    message: 'Sorry, something went wrong. Please try again later.',
    fields: payload
  }
}