'use client'

import {Button} from "@/components/ui/button";
import {useActionState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {sendEventReminder} from "@/app/actions/profile/reminder.action";

export function ButtonEventReminder({email, name} : {email: string, name: string}) {
  const [state, formAction, isPending] = useActionState(sendEventReminder, null)
  return (
    <form action={formAction}>
      <input name="email" type="hidden" value={email} />
      <input name="name" type="hidden" value={name} />
      <Button size="sm" type="submit" disabled={isPending}>
        {isPending ? <Spinner /> : null}
        Send Event Reminder
      </Button>
    </form>
  )
}