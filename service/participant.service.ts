'use server'

import {db} from "@/db/db";
import {sql} from "drizzle-orm";
import {participant} from "@/db/schema";

export async function createParticipant(eventId: number, userId: string) {
  await db.insert(participant).values({
    userId,
    eventId,
    status: 'confirmed',
    bibNumber: sql`(SELECT COALESCE(MAX(${participant.bibNumber}), 0) + 1
                    FROM ${participant}
                    WHERE ${participant.eventId} = 1)`,
  });
}