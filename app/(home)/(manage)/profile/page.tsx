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

  const joinedEvents = await getEventsByUserId(session.user.id)

  return (
    <div>
      {joinedEvents.length < 1 && (
        <div className="text-center gap-x-6 bg-gold-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 mb-6">
          <p className="text-sm/6 text-white">
            <a href="https://www.barongmelali.com/event/1">
              <strong className="font-semibold">
                Barong X Anniversary Jersey Launching Ride
              </strong>
              <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              JOIN NOW. LIMITED SLOT AVAILABLE. &nbsp;<span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      )}

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