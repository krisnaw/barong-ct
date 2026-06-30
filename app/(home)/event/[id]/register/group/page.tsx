import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getEventById} from "@/db/query/event-query";
import {StepGroup} from "@/components/checkout/step-group";
import {getGroupsByEvent} from "@/db/query/event-group.query";
import {getOnGoingParticipant} from "@/db/query/participant-query";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {StepWizard} from "@/components/ui/step-wizard";
import {getRegistrationSteps} from "@/app/(home)/event/[id]/register/steps";

export default async function Page({params, searchParams}: {
  params: Promise<{ id: number }>,
  searchParams: Promise<{ groupId: string; category: string; group: string }>
}) {
  const {id} = await params;
  const event = await getEventById(id)

  const {groupId, category, group} = await searchParams
  const returnParams = new URLSearchParams({groupId, category, group})
  const returnURL = `/event/${id}/register/group?${returnParams.toString()}`

  if (!event) {
    redirect(`/event`);
  }

  // if (isRegistrationClosed(event.registrationClosesAt)) {
  //   redirect(`/event/${id}`)
  // }

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect(`/auth/signup?returnUrl=${encodeURIComponent(returnURL)}`)
  }

  const userId = session.user.id;

  // Check if user has been registered before or not
  const participant = await getOnGoingParticipant(id, userId);
  if (participant) {
    if (participant.status == PARTICIPANT_STATUS.COMPLETED) {
      // redirect to an event detail because the user has been registered.
      redirect(`/event/${id}`)
    }
  }

  const groups = await getGroupsByEvent(id)

  return (
    <div className="space-y-6">
      <StepWizard steps={getRegistrationSteps("group")} />
      <StepGroup event={event} userId={userId} categories={event.categories} groups={groups}/>
    </div>
  )
}
