import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import * as React from "react";
import Image from "next/image";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {buttonVariants} from "@/components/ui/button";

const stats = [
  { name: 'Distance', value: '140', unit: 'km' },
  { name: 'Elevation Gain', value: '2,370', unit: 'm' },
  { name: 'Pit stops', value: '3' },
  { name: 'Cutoff time', value: '5', unit: 'hours' },
]

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);

  if (!event) {
    redirect('/');
  }

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect('/auth/signup')
  }

  const order = await getOngoingOrder(id, session.user.id);
  console.log(order)

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="relative isolate overflow-hidden h-[50vh]">
        <Image
          src={event.feature_image ?? "/empty-banner.png"}
          alt={event.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 pt-10 pb-24">
        <div className="space-y-4">

          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent>

              {order ? (
                <>
                  {order.status != 'paid' ? (
                    <div>
                      <Link href={`/event/${id}/register`} className={`${buttonVariants({ variant: "default", size: "lg" })} w-full uppercase`}>
                        Continue Registrations
                      </Link>
                    </div>
                  ) : (
                    <div>
                      Regis Complete
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <Link href={`/event/${id}/register`} className={`${buttonVariants({ variant: "default", size: "lg" })} w-full uppercase`}>
                    Register now
                  </Link>
                </div>
              )}



            </CardContent>
          </Card>





          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
              <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
              <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}