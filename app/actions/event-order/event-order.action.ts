'use server'

import {eventOrder, orderInsertSchema, orderUpdateSchema} from "@/db/schema";
import {db} from "@/db/db";
import {redirect} from "next/navigation";
import {z} from "zod";
import {ActionResponse} from "@/types/types";
import {eq} from "drizzle-orm";

export type updateData = z.infer<typeof orderUpdateSchema>;

export async function updateOrderAction(formData: updateData): Promise<ActionResponse> {
  console.log(formData)
  try {
    await db.update(eventOrder).set(formData).where(eq(eventOrder.id, Number(formData.id)))
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }

    return {
      success: false,
      message: 'Sorry, something went wrong',
      data: formData.id
    }
  }
  return {
    success: true,
    message: 'Successfully created order',
    data: formData.id
  }
}

export type insertData = z.infer<typeof orderInsertSchema>;

export async function createOrderAction(formData: insertData) {
  let url = ""
  try {
    const [order] = await db.insert(eventOrder).values(formData).returning()
    url = `/event/${order.eventId}/order`
  } catch (error) {
    console.log(error)

    if (error instanceof Error) {
      console.error(error)
    }

    return {
      success: false,
      message: 'Sorry, something went wrong',
    }
  }
  redirect(url)
}