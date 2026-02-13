'use server'

import {EventInsertSchema, EventSchema, EventUpdateSchema} from "@/db/schema";
import {z} from "zod";
import {db} from "@/db/db";
import {redirect} from "next/navigation";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";

export type insertData = z.infer<typeof EventInsertSchema>;
export async function createEventAction(formData: insertData) {

  const validate = EventInsertSchema.safeParse(formData);

  if (!validate.success) {
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(validate.error),
      fields: validate.data,
    }
  }


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

export type updateData = z.infer<typeof EventUpdateSchema>;

export async function UpdateEventAction(formData: updateData) {
  try {
    await db.update(EventSchema)
      .set(formData)
      .where(eq(EventSchema.id, Number(formData.id)))
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