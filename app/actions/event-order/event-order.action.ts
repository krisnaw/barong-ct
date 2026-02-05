'use server'

import {eventOrder, orderInsertSchema, orderUpdateSchema} from "@/db/schema";
import {db} from "@/db/db";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";
import {ActionResponse} from "@/types/types";
import {eq} from "drizzle-orm";

export type updateData = z.infer<typeof orderUpdateSchema>;

export async function updateOrderAction(formData: updateData) : Promise<ActionResponse> {
  try {
    await db.update(eventOrder).set(formData).where(eq(eventOrder.id, Number(formData.id)))
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
  return {
    success:  true,
    message: 'Successfully created order',
    data: formData.id
  }
}



export type insertData = z.infer<typeof orderInsertSchema>;
export async function createOrderAction(formData: insertData) {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect('/auth/signup')
  }

  let orderId: number

  formData.userId = session.user.id

  try {
    const [order] = await db.insert(eventOrder).values(formData).returning()

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