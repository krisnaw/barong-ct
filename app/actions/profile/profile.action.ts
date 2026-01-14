'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import {User} from "@/types/auth-types";

export async function UpdateProfileAction(payload: Partial<User>) : Promise<ActionResponse> {
  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: payload.name,
        image: payload.image,
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