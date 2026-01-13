import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

export default async function ProfilePage() {

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  return (
    <div>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Make changes to your account here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}