'use server'

import {db} from "@/db/db";
import {eventPromoSchema, promoInsertSchema} from "@/db/schema";
import {eq} from "drizzle-orm";
import {z} from "zod";
import {revalidatePath} from "next/cache";

export type insertData = z.infer<typeof promoInsertSchema>;

export async function createPromoAction(formData: insertData) {
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

export async function deletePromoAction(formData: FormData) {
  console.log('asf')
  const promoId = formData.get("promoId");
  await db.delete(eventPromoSchema).where(eq(eventPromoSchema.id, Number(promoId)));
  revalidatePath('/', 'page');
}