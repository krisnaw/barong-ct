'use client'

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {SignUpAction} from "@/app/actions/auth/signup.action";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";

export function SignupForm({buttonText = "Sign up" } : { buttonText? : string} ) {

  const [_, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {
    const email = formData.get("email") as string;
    const res = await SignUpAction(email);
    toast.info(res.message)
    return res;
  }, initialState)

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="email"
               className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">E-Mail Address</label>
        <div className="flex items-center gap-2">
          <Input className="bg-white"
                 id="email"
                 type="email"
                 name="email"
                 autoComplete="email"
                 placeholder="m@example.com"
                 required />

          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : null }
            {buttonText}
          </Button>
        </div>
      </div>
    </form>
  )
}
