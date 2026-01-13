'use server'

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {ActionResponse} from "@/types/types";

export async function SignUpAction() : Promise<ActionResponse> {

  const data = await auth.api.signInMagicLink({
    body: {
      email: "krisna.w2010@gmail.com", // required
      name: "my-name",
      callbackURL: "/profile",
      newUserCallbackURL: "/profile",
      errorCallbackURL: "/auth/error",
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  console.log(data);
  return {
    success: true,
    message: "Sign up successfully",
  }
}