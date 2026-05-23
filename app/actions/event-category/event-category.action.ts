'use server'

import {revalidatePath} from "next/cache";
import {db} from "@/db/db";
import {eventCategory, EventCategoryInsertSchema, EventCategoryUpdateSchema} from "@/db/schema";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {getOrderByCategory} from "@/db/query/event-order.query";

export type EventCategoryType = z.infer<typeof EventCategoryInsertSchema>;

export async function createCategoryAction(formData: EventCategoryType)  {
  const validate = EventCategoryInsertSchema.safeParse(formData);

  if (!validate.success) {
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

export type UpdateCategoryData = z.infer<typeof EventCategoryUpdateSchema>;
export async function updateCategoryAction(formData: UpdateCategoryData)  {
  const validate = EventCategoryUpdateSchema.safeParse(formData);

  if (!validate.success) {
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(validate.error),
      fields: validate.data,
    }
  }

  try {
    await db.update(eventCategory).set(validate.data).where(eq(eventCategory.id, Number(formData.id)))
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
    message: "Success, category was updated."
  }
}

export async function deleteCategoryAction(id: number) : Promise<void>  {
  const order = await getOrderByCategory(id)
  if (!order) {
    await db.delete(eventCategory).where(eq(eventCategory.id, id))
  }
  revalidatePath('/', 'page')
}