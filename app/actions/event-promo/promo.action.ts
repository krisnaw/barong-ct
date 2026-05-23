'use server'
import {eventPromoSchema, InsertPromoType, promoUpdateSchema, UpdatePromoType} from "@/db/schema";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {db} from "@/db/db";
import {getOrderByPromo} from "@/db/query/event-order.query";

export async function createPromoAction(formData: InsertPromoType) {
  try {
    await db.insert(eventPromoSchema).values(formData).returning()
  } catch (e) {
    if (e instanceof Error) {
      console.error(e)
      return {
        success: false,
        message: "Sorry, something went wrong",
      }
    }
  }

  revalidatePath('/', 'page')

  return {
    success: true,
    message: "Promo created successfully",
  }
}

export async function updatePromo(formData: UpdatePromoType) {
  const validate = promoUpdateSchema.safeParse(formData)
  if (!validate.success) {
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(validate.error),
      fields: validate.data,
    }
  }

  await db.update(eventPromoSchema).set(validate.data).where(eq(eventPromoSchema.id, Number(formData.id)));
  revalidatePath('/', 'page');
  return {
    success: true,
    message: "Success, promo has been updated",
  }
}

export async function deletePromoAction(id: number) {
  const order = await getOrderByPromo(id)
  if (order) {
    return {
      success: false,
      message: "This category has active registrations and cannot be deleted.",
    }
  }
  await db.delete(eventPromoSchema).where(eq(eventPromoSchema.id, Number(id)));
  revalidatePath('/', 'page');
  return {
    success: true,
    message: "Success, promo was deleted."
  }
}