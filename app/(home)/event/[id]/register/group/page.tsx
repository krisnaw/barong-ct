import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getEventById} from "@/db/query/event-query";
import {getCategoryByEvent} from "@/db/query/event-category.query";
import {StepGroup} from "@/components/checkout/step-group";
import {getGroupsByEvent} from "@/db/query/event-group.query";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
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

  const categories = await getCategoryByEvent(id)
  const groups = await getGroupsByEvent(id)

  return (
    <div>
      <StepGroup event={event} userId={userId} categories={categories} groups={groups} />
    </div>
  )
}