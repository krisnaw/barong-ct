'use server'
import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {eventGroup} from "@/db/schema";
import {revalidatePath} from "next/cache";

export async function createGroupAction(payload: {name: string, eventId: number, eventCategoryId: number}) : Promise<ActionResponse> {
  const [group] = await db.insert(eventGroup).values(payload).returning();

  revalidatePath('/', 'page')

  return {
    success: true,
    message: `Success, group was created.`,
    data: group.id
  }
}