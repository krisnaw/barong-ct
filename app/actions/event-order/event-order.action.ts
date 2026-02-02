'use server'

import {eventOrder} from "@/db/schema";
import {db} from "@/db/db";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export async function createOrderAction(payload: {
  eventId: number, categoryId: number, groupId: number
}) {


  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect('/auth/signup')
  }

  let orderId: number

  console.log(payload)

  try {
    const [order] = await db.insert(eventOrder).values({
      userId: session.user.id,
      eventId: payload.eventId,
      categoryId: payload.categoryId,
      groupId: payload.groupId,
    }).returning()

    orderId = order.id

  } catch (error) {
    console.log(error)

    if (error instanceof Error) {
      console.error(error)
    }

    return {
      success:  false,
      message: 'Sorry, something went wrong',
    }
  }

  return {
    success:  true,
    message: 'Successfully created order',
    data: orderId
  }
}