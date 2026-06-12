'use server'

import {db} from "@/db/db";
import {desc, eq} from "drizzle-orm";
import {eventCategory} from "@/db/schema";

export async function getCategoryByEvent(eventId: number) {
  return db.query.eventCategory.findMany({
    where: eq(eventCategory.eventId, eventId),
    orderBy: desc(eventCategory.name),
    with: {
      participants: {
        columns: {
          bibNumber: true,
        },
        with: {
          user: {
            columns: { name: true }
          }
        }
      }
    }
  })
}

export async function getCategoryById(id: number) {
  return db.query.eventCategory.findFirst({
    where: eq(eventCategory.id, id)
  })
}
