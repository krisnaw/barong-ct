'use server'
import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {eventGroup, InsertGroupType} from "@/db/schema";
import {revalidatePath} from "next/cache";
import {eq} from "drizzle-orm";

export async function createGroupAction(formData: InsertGroupType) : Promise<ActionResponse> {
  const [group] = await db.insert(eventGroup).values(formData).returning();
  revalidatePath(`/event/${group.eventId}/register/group`, 'page')
  return {
    success: true,
    message: `Success, group was created.`,
    data: group.id
  }
}

export async function updateGroupCategoryAction(groupId: number, categoryId: number | null): Promise<ActionResponse> {
  await db
    .update(eventGroup)
    .set({ eventCategoryId: categoryId })
    .where(eq(eventGroup.id, groupId))

  revalidatePath(`/`, 'page')

  return {
    success: true,
    message: "Success, group category was updated.",
  }
}

export async function updateGroupAction(formData: Pick<InsertGroupType, "name" | "eventId" | "eventCategoryId"> & { id: number }) : Promise<ActionResponse> {
  const name = formData.name?.trim()

  if (!name) {
    return {
      success: false,
      message: "Group name is required.",
    }
  }

  await db
    .update(eventGroup)
    .set({ name, eventCategoryId: formData.eventCategoryId })
    .where(eq(eventGroup.id, formData.id))

  revalidatePath(`/`, 'page')

  return {
    success: true,
    message: "Success, group was updated.",
  }
}
