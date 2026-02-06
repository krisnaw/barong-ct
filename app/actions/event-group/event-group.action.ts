'use server'
import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {eventGroup, eventOrder} from "@/db/schema";
import {revalidatePath} from "next/cache";
import {eq} from "drizzle-orm";

export async function createGroupAction(payload: {name: string, eventId: number, orderId: number}) : Promise<ActionResponse> {
  const [group] = await db.insert(eventGroup).values(payload).returning();
  await db.update(eventOrder).set({
    groupId: group.id,
  }).where(eq(eventOrder.id, payload.orderId))

  revalidatePath(`/event/${group.eventId}/category`, 'page')

  return {
    success: true,
    message: `Success, group was created.`,
    data: group
  }
}