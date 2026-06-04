"use client"

import {InboxIcon} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useActionState, useState} from "react"
import {ActionResponse, initialState} from "@/types/types";
import {SignUpAction} from "@/app/actions/auth/signup.action";
import {toast} from "sonner";
import {Spinner} from "@/components/ui/spinner";

function CheckEmailState({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center gap-4 px-2 py-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <InboxIcon className="size-7" />
      </div>
      <div className="space-y-1.5">
        <p className="text-base font-bold">Check your Email</p>
        <p className="text-sm text-muted-foreground">We sent a login link to <span className="font-semibold text-foreground">{email}</span></p>
      </div>
    </div>
  )
}

export function EventDetailWithSignup({returnURL}: {returnURL: string}) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const [_, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {
    const email = formData.get("email") as string;
    const res = await SignUpAction(email, returnURL);
    toast.info(res.message)
    setSubmitted(true)
    return res;
  }, initialState)

  return (
    <>
      {submitted ? (
        <CheckEmailState email={email} />
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold">Create an account to register for this event</p>
            <p className="text-xs text-muted-foreground">Enter your email and we&apos;ll send you a magic link to sign in or create an account.</p>
          </div>
          <form action={formAction}>
            <div className="flex gap-2">
              <Input className="bg-white"
                     id="email"
                     type="email"
                     name="email"
                     autoComplete="email"
                     placeholder="m@example.com"
                     onChange={(e) => setEmail(e.target.value)}
                     required />

              <Button
                type="submit"
                disabled={!email || isPending}
              >
                {isPending ? <Spinner /> : null }
                Sign up
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}