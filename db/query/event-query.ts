"use server"

import {EventType} from "@/db/schema";
import {db} from "@/db/db";

export async function getEvents(): Promise<EventType[] | []> {
  const events = await db.query.EventSchema.findMany()
  return events ?? []
}