'use server'

import {revalidatePath} from "next/cache";
import {db} from "@/db/db";
import {eventCategory} from "@/db/schema";

export async function createCategoryAction(formData: FormData) : Promise<void> {

  await db.insert(eventCategory).values({
    eventId: Number(formData.get("eventId")),
    name: formData.get("name") as string,
  })

  revalidatePath('/', 'page')

}