'use server'

import {eventOrder, orderUpdateSchema} from "@/db/schema";
import {db} from "@/db/db";
import {z} from "zod";
import {ActionResponse} from "@/types/types";
import {eq} from "drizzle-orm";

export type updateData = z.infer<typeof orderUpdateSchema>;

export async function updateOrderAction(formData: updateData): Promise<ActionResponse> {

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