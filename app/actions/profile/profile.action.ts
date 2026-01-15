'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import {User} from "@/types/auth-types";
import {db} from "@/db/db";
import {userDetail, UserDetailType} from "@/db/schema/user-detail-schema";

export async function UpdateProfileAction(payload: Partial<User & UserDetailType>): Promise<ActionResponse> {
  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: payload.name,
        image: payload.image,
      }
    })

    console.log(payload)

    await db.insert(userDetail)
      .values({
        userId: String(payload.id),
        instagram: payload.instagram,
      })
      .onConflictDoUpdate({
        target: userDetail.userId,
        set: {
          instagram: payload.instagram,
        }
      })

    revalidatePath("/", "page")

    return {
      success: true,
      message: 'Success, profile was updated'
    }
  } catch (err) {
    console.log(err);
  }

  return {
    success: false,
    message: 'Sorry, something went wrong. Please try again later.'
  }
}