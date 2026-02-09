'use server'

import {EventInsertSchema, EventSchema, EventType} from "@/db/schema";
import {z} from "zod";
import {db} from "@/db/db";
import {redirect} from "next/navigation";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";

export async function createEventAction(payload: Partial<EventType & { eventDate: string, eventTime: string }>) {

  const validate = EventInsertSchema.safeParse(payload);
  const dateTimeString = `${payload.eventDate}T${payload.eventTime}`; // "2025-01-31T14:30:00"
  const localDate = new Date(dateTimeString);

  if (!validate.success) {
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(validate.error),
      fields: validate.data,
    }
  }

  validate.data.startDate = localDate;

  try {
    await db.insert(EventSchema).values(validate.data);

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

export async function UpdateEventAction(payload: Partial<EventType & { eventDate: string, eventTime: string }>) {

  try {
    await db.update(EventSchema)
      .set(payload)
      .where(eq(EventSchema.id, Number(payload.id)))
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

  revalidatePath('/')

  return {
    success: true,
    message: 'Success, event was updated.'
  }
}

export async function DeleteEventAction(id: number) {
  await db.delete(EventSchema).where(eq(EventSchema.id, id));
  redirect('/dashboard');
}