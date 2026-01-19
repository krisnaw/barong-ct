import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ProfileForm} from "@/components/profile/profile-form";
import {ListEvent} from "@/components/events/list-event";
import {redirect} from "next/navigation";
import {getUserWithDetail} from "@/db/query/user-query";
import {getEventsByUserId} from "@/db/query/event-query";
import {Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty";
import {Bike} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

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

  const joinedEvents = await getEventsByUserId(session.user.id)

  return (
    <div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="joined-events">Joined events</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="pt-6">
          <ProfileForm user={userDetail} />
        </TabsContent>
        <TabsContent value="joined-events" className="pt-6">
          {joinedEvents.length > 0 ? (
            <ListEvent events={joinedEvents} />
          ) : (
            <div>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Bike />
                  </EmptyMedia>
                  <EmptyTitle>You haven’t joined any events yet.</EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                  <Button>
                    <Link href="/event">
                      Explore Events
                    </Link>
                  </Button>
                </EmptyContent>
              </Empty>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}