import {StepProfile} from "@/components/checkout/step-profile";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getUserWithDetail} from "@/db/query/user-query";
import {redirect} from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect(`/auth/signup`)
  }

  const user = await getUserWithDetail(session.user.id)
  return (
    <div>
      <StepProfile user={user} />
    </div>
  )
}