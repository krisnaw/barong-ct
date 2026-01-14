'use server'

import {EventInsertSchema, EventSchema, EventType} from "@/db/schema";
import {z} from "zod";
import {db} from "@/db/db";
import {redirect} from "next/navigation";
import {eq} from "drizzle-orm";

export async function CreateEventAction(payload: Partial<EventType>) {

  const validate = EventInsertSchema.safeParse(payload);

  if (!validate.success) {
    console.error(validate.error);
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(validate.error),
      fields: validate.data,
    }
  }

  try {
    await db.insert(EventSchema).values({
      name: validate.data.name,
      description: validate.data.description,
      startDate: validate.data.startDate
    });

  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      return {
        success: false,
        message: error.message,
        fields: validate.data,
      }
    }
    return {
      success: false,
      message: "Failed to create event",
      fields: validate.data,
    }
  }
  
  return {
    success: true,
    message: 'Success, event was created.'
  }
}

export async function UpdateEventAction(payload: Partial<EventType>) {
  try {
    await db.update(EventSchema).set({
      name: payload.name,
      description: payload.description,
    })
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      return {
        success: false,
        message: error.message,
      }
    }
    return {
      success: false,
      message: "Failed to update event",
    }
  }

  return {
    success: true,
    message: 'Success, event was updated.'
  }
}

export async function DeleteEventAction(id: number) {
  await db.delete(EventSchema).where(eq(EventSchema.id, id));
  redirect('/dashboard');
}