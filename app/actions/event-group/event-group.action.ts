'use server'
import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {eventGroup, InsertGroupType} from "@/db/schema";
import {revalidatePath} from "next/cache";

export async function createGroupAction(formData: InsertGroupType) : Promise<ActionResponse> {
  const [group] = await db.insert(eventGroup).values(formData).returning();
  revalidatePath(`/event/${group.eventId}/register/group`, 'page')
  return {
    success: true,
    message: `Success, group was created.`,
    data: group.id
  }
}