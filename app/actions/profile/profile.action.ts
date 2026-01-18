'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import {User} from "@/types/auth-types";
import {db} from "@/db/db";
import {userDetail, UserDetailType} from "@/db/schema/user-detail-schema";
import {format} from "date-fns";

export async function UpdateProfileAction(payload: Partial<User & UserDetailType>): Promise<ActionResponse> {
  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: payload.name,
        image: payload.image,
      }
    })
    payload.userId = String(payload.id)
    payload.dateOfBirth = payload.dateOfBirth ? format(new Date(payload.dateOfBirth), 'yyyy-MM-dd') : undefined;

    await db.insert(userDetail)
      .values({
        userId: String(payload.id),
        phoneNumber: payload.phoneNumber,
        instagram: payload.instagram,
        strava: payload.strava,
        emergencyContactName: payload.emergencyContactName,
        emergencyContactNumber: payload.emergencyContactNumber,
        identityNumber: payload.identityNumber,
        address: payload.address,
      })
      .onConflictDoUpdate({
        target: userDetail.userId,
        set: payload
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