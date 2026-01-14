'use server'

import {EventInsertSchema, EventSchema, EventType} from "@/db/schema";
import {z} from "zod";
import {db} from "@/db/db";

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
      message: "Failed to create brief",
      fields: validate.data,
    }
  }
  
  return {
    success: true,
    message: 'Success, event was created.'
  }
}