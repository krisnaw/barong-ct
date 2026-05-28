import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getEventById} from "@/db/query/event-query";
import {StepGroup} from "@/components/checkout/step-group";
import {getGroupsByEvent} from "@/db/query/event-group.query";

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

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect(`/auth/signup?returnUrl=${encodeURIComponent(returnURL)}`)
  }

  const userId = session.user.id;

  const groups = await getGroupsByEvent(id)

  return (
    <div>
      <StepGroup event={event} userId={userId} categories={event.categories} groups={groups}/>
    </div>
  )
}