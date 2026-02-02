'use server'

import {eventOrder, orderSelectSchema} from "@/db/schema";
import {db} from "@/db/db";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";
import {ActionResponse} from "@/types/types";

export type orderData = z.infer<typeof orderSelectSchema>;

export async function updateOrderAction(formData: orderData) : Promise<ActionResponse> {
  await db.update(eventOrder).set(formData);
  return {
    success:  true,
    message: 'Successfully created order',
    data: formData.id
  }
}

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