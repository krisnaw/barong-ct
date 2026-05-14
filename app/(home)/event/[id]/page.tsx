import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import * as React from "react";
import Image from "next/image";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {getOngoingOrder} from "@/db/query/event-order.query";
import {buttonVariants} from "@/components/ui/button";
import {ORDER_STATUS} from "@/utils/event.helper";
import {Item, ItemContent} from "@/components/ui/item";
import {Badge} from "@/components/ui/badge";
import {getPaymentByOrder} from "@/db/query/event-payment.query";
import {getParticipantByEventUser} from "@/db/query/participant-query";

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
  let payment = undefined
  let participant = undefined
  if (order) {
    payment = await getPaymentByOrder(order.id)
    participant = await getParticipantByEventUser(id, session.user.id);
  }

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
              {order ? (
                <CardAction>
                  <Badge variant="secondary" className="uppercase">{order.status}</Badge>
                </CardAction>
              ) : null}
            </CardHeader>
            <CardContent>

              {order ? (
                <>
                  {order.status != ORDER_STATUS.COMPLETED ? (
                    <div>
                      <Link href={`/event/${id}/register`}
                            className={`${buttonVariants({variant: "default", size: "lg"})} w-full uppercase`}>
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
                  <Link href={`/event/${id}/register`}
                        className={`${buttonVariants({variant: "default", size: "lg"})} w-full uppercase`}>
                    Register now
                  </Link>
                </div>
              )}

            </CardContent>
          </Card>


          {order && order.status == ORDER_STATUS.COMPLETED && (
            <>
              {participant ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Participant</CardTitle>
                    <CardAction>
                      <Badge
                        className="bg-green-50 text-green-700 uppercase inset-ring inset-ring-green-600/20">{participant.status}</Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent>

                    <Item variant="muted">
                      <ItemContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-muted-foreground">
                        BIB NUMBER
                      </span>
                            <span className="text-lg font-semibold tabular-nums">
                        001
                      </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-muted-foreground uppercase">
                        Jersey Size
                      </span>
                            <span className="text-lg font-semibold tabular-nums">
                        L
                      </span>
                          </div>
                        </div>
                      </ItemContent>
                    </Item>


                  </CardContent>
                </Card>
              ) : null}

              {payment ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice #{payment.invoiceNumber}</CardTitle>
                    <CardDescription>Paid at {payment.updatedAt.toLocaleDateString()}</CardDescription>
                    <CardAction>
                      <Badge
                        className="bg-green-50 text-green-700 uppercase inset-ring inset-ring-green-600/20">{payment.status}</Badge>
                    </CardAction>
                  </CardHeader>
                </Card>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}