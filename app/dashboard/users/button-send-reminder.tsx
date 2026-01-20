'use client'

import {Button} from "@/components/ui/button";
import {useActionState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {sendProfileReminder} from "@/app/actions/profile/reminder.action";

export function ButtonSendReminder({email} : {email: string}) {
  const [state, formAction, isPending] = useActionState(sendProfileReminder, null)
  return (
    <form action={formAction}>
      <input name="email" type="hidden" value={email} />
      <Button size="sm" type="submit" disabled={isPending}>
        {isPending ? <Spinner /> : null}
        Send Reminder
      </Button>
    </form>
  )
}