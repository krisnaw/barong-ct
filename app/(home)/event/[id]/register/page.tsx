import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getOnGoingParticipant} from "@/db/query/participant-query";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";

export default async function Page({params, searchParams}: {
  params: Promise<{ id: number }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const {id} = await params;
  const event = await getEventById(id)
  if (!event) {
    redirect(`/event`);
  }

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })
  if (!session) {
    redirect('/auth/signup')
  }

  const userId = session.user.id;

  const participant = await getOnGoingParticipant(id, userId);

  if (!participant) {
    redirect(`/event/${id}/register/group`)
  }

  // Always redirect to order
  if (participant) {
    const status = participant.status;

    if (status == PARTICIPANT_STATUS.DRAFT) {
      if (!participant.groupId || !participant.jerseySize) {
        redirect(`/event/${id}/register/group`)
      } else {
        redirect(`/event/${id}/register/profile`)
      }
    }

    if (status == PARTICIPANT_STATUS.PROFILE) {
      redirect(`/event/${id}/register/payment?participantId=${participant.id}`)
    }

    if (status == PARTICIPANT_STATUS.PENDING_PAYMENT) {
      redirect(`/event/${id}/register/payment?participantId=${participant.id}`)
    }

    if (status == PARTICIPANT_STATUS.COMPLETED) {
      redirect(`/event/${id}`)
    }
  }

  return (
    <div>
      Register
    </div>
  )
}