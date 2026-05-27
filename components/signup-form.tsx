'use client'

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {SignUpAction} from "@/app/actions/auth/signup.action";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div"> ) {

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const email = formData.get("email") as string;
    const res = await SignUpAction(email);
    toast.info(res.message)

    return res;
  }, initialState)


  return (
    <form action={formAction}>
      <div className="flex flex-col w-full">
        <label htmlFor="email" className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">E-Mail Address</label>
        <div className="mt-2">
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="mt-2">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Spinner /> : null }
            Sign up
          </Button>
        </div>
      </div>
    </form>
  )
}
