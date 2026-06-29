'use client'

import {useActionState} from "react";
import {ActionResponse, initialState} from "@/types/types";
import {resendEmailConfirmation} from "@/app/actions/event-participant/event-participant.action";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {Send} from "lucide-react";

export function BtnResendConfirm({participantId}: { participantId: number }) {
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (_: ActionResponse, formData: FormData) => {
    const res = await resendEmailConfirmation(participantId)
    toast.info(res.message)
    return res;
  }, initialState)

  return (
    <form action={formAction}>
      <Button size="sm" variant="outline" type="submit" disabled={isPending}>
        {isPending ? <Spinner/> : <Send/> }
        Resend confirmation
      </Button>
    </form>
  )
}
