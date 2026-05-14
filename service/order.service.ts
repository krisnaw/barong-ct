"use server"

import {db} from "@/db/db";
import {eventOrder} from "@/db/schema";
import {eq} from "drizzle-orm";

export async function updateOrderStatus(id: number, status: string) {
  await db.update(eventOrder).set({status }).where(eq(eventOrder.id, id))
}