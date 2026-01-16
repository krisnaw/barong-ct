'use server'

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {ActionResponse} from "@/types/types";
import {redirect} from "next/navigation";

export async function SignUpAction(email: string) : Promise<ActionResponse> {
  const data = await auth.api.signInMagicLink({
    body: {
      email: email.trim(), // required
      callbackURL: "/profile",
      newUserCallbackURL: "/profile",
      errorCallbackURL: "/auth/error",
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  return {
    success: true,
    message: "Success, please check your email address.",
  }
}

export async function signOut() {
  await auth.api.signOut()
  redirect("/")
}