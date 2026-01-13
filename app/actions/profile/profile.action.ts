'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export async function UpdateProfileAction() : Promise<ActionResponse> {

  await auth.api.updateUser({
    headers: await headers(),
    body: {
      name: "John doe"
    }
  })

  return {
    success: true,
    message: 'Success, profile was updated'
  }
}