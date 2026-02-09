'use server'

import {db} from "@/db/db";
import {eventPromoSchema, promoInsertSchema} from "@/db/schema";
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