"use server"

import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {participant} from "@/db/schema";

export async function getParticipantByEvent(eventId: number) {
  return await db.query.participant.findMany({
    where: eq(participant.eventId, eventId),
    with: {
      user: true
    }
  });
}