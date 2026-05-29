'use server'

import {db} from "@/db/db";
import {and, eq, sql} from "drizzle-orm";
import {participant} from "@/db/schema";

const GENDER_PREFIX = {
  male: 1,
  female: 2,
} as const

export async function generateBibNumber(gender: "male" | "female", eventId: number): Promise<string> {
  const prefix = GENDER_PREFIX[gender]
  const minBib = prefix * 1000
  const maxBib = minBib + 999

  const result = await db
    .select({ max: sql<number>`coalesce(max(${participant.bibNumber}), ${minBib})` })
    .from(participant)
    .where(
      and(
        eq(participant.eventId, eventId),
        sql`${participant.bibNumber} between ${minBib} and ${maxBib}`,
      ),
    )

  const currentMax = Number(result[0]?.max ?? minBib)
  return String(currentMax + 1)
}
