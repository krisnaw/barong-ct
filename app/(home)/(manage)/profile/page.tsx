import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ProfileForm} from "@/components/profile/profile-form";
import {redirect} from "next/navigation";
import {getUserWithDetail} from "@/db/query/user-query";

export default async function ProfilePage() {

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect("/auth/signup")
  }

  const userDetail = await getUserWithDetail(session.user.id)

  if (!userDetail) {
    redirect("/auth/login")
  }

  return (
    <div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Joined events</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ProfileForm user={userDetail} />
        </TabsContent>
        <TabsContent value="password">

          List of joined events

        </TabsContent>
      </Tabs>
    </div>
  )
}