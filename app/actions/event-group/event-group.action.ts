'use server'
import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {eventGroup} from "@/db/schema";
import {revalidatePath} from "next/cache";

export async function createGroupAction(payload: {name: string, eventId: number, categoryId: number}) : Promise<ActionResponse> {
  await db.insert(eventGroup).values(payload);
  revalidatePath('/', 'page')
  return {
    success: true,
    message: `Create a new event group`,
  }
}