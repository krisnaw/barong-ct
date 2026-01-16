import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ProfileForm} from "@/components/profile/profile-form";
import {ListEvent} from "@/components/events/list-event";
import {redirect} from "next/navigation";
import {getUserWithDetail} from "@/db/query/user-query";
import {getEventsByUserId} from "@/db/query/event-query";

export default async function ProfilePage() {

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect("/auth/signup")
  }

  const userDetail = await getUserWithDetail(session.user.id)
  const joinedEvents = await getEventsByUserId(session.user.id)

  if (!userDetail) {
    redirect("/auth/login")
  }

  return (
    <div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="joined-events">Joined events</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ProfileForm user={userDetail} />
        </TabsContent>
        <TabsContent value="joined-events">
          <ListEvent events={joinedEvents} />
        </TabsContent>
      </Tabs>
    </div>
  )
}