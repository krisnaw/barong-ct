'use client'

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Field, FieldDescription, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {SignUpAction} from "@/app/actions/auth/signup.action";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {

    const email = formData.get("email") as string;
    const res = await SignUpAction(email);
    toast.info(res.message)

    return res;
  }, initialState)


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>

      <form action={formAction}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <img
                alt="Barong Cycling Logo"
                src="/barong-no-bg.svg"
                className="h-24"
              />
              <span className="sr-only">Barong Cycling.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Barong Cycling</h1>
            <FieldDescription>
              Please fill with your email address to sign up or sign to you account
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : null }
              Sign up
            </Button>
          </Field>
        </FieldGroup>
      </form>
      {/*<FieldDescription className="px-6 text-center">*/}
      {/*  By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}*/}
      {/*  and <a href="#">Privacy Policy</a>.*/}
      {/*</FieldDescription>*/}
    </div>
  )
}
