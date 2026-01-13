'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";

type ProfileData = { full_name: string }

export async function UpdateProfileAction(payload: ProfileData) : Promise<ActionResponse> {

  console.log(payload);

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: payload.full_name,
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