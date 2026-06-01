import * as React from "react";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getUserWithDetail} from "@/db/query/user-query";
import {getOnGoingParticipant} from "@/db/query/participant-query";
import {StepProfile} from "@/components/checkout/step-profile";
import {StepWizard} from "@/components/ui/step-wizard";
import {getRegistrationSteps} from "@/app/(home)/event/[id]/register/steps";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect(`/auth/signup`)
  }

  const user = await getUserWithDetail(session.user.id)
  const participant = await getOnGoingParticipant(id, user.id);
  if (!participant) {
    redirect('/event')
  }
  return (
    <div className="space-y-6">
      <StepWizard steps={getRegistrationSteps("profile")} />
      <StepProfile user={user} participant={participant} />
    </div>
  )
}