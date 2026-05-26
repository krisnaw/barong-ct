'use server'

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {ActionResponse} from "@/types/types";
import {redirect} from "next/navigation";

export async function SignUpAction(email: string, refURL? : string) : Promise<ActionResponse> {
  await auth.api.signInMagicLink({
    body: {
      email: email.trim(), // required
      callbackURL: refURL ?? "/",
      newUserCallbackURL: refURL ?? "/",
      errorCallbackURL: "/auth/error",
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  return {
    success: true,
    message: "Click the confirmation link we sent to your email. Don’t forget to check your spam folder.",
  }
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  })
  redirect("/")
}