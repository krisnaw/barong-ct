'use server'

import {revalidatePath} from "next/cache";
import {db} from "@/db/db";
import {eventCategory, EventCategoryInsertSchema} from "@/db/schema";
import {z} from "zod";

export type EventCategoryType = z.infer<typeof EventCategoryInsertSchema>;

export async function createCategoryAction(formData: EventCategoryType)  {
  const validate = EventCategoryInsertSchema.safeParse(formData);

  if (!validate.success) {
    console.log(z.flattenError(validate.error))
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(validate.error),
      fields: validate.data,
    }
  }

  try {
    await db.insert(eventCategory).values(validate.data).returning()
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

  revalidatePath('/', 'page')

  return {
    success: true,
    message: "Success, category was created."
  }

}