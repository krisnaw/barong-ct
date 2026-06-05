'use server'

import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {InsertParticipantType, participant, participantInsertSchema, UpdateParticipantType} from "@/db/schema";
import {getEventById} from "@/db/query/event-query";
import {revalidatePath} from "next/cache";
import {eq} from "drizzle-orm";
import {getParticipantById} from "@/db/query/participant-query";
import {z} from "zod";
import {sendEmailConfirmation} from "@/service/participant.service";
import {getUserWithDetail} from "@/db/query/user-query";

export async function resendEmailConfirmation(participantId: number): Promise<ActionResponse> {

  const participant = await getParticipantById(participantId)
  if (!participant) {
    return {
      success: false,
      message: `Sorry no participant`,
    }
  }

  const user = await getUserWithDetail(participant.userId)
  const event = await getEventById(participant.eventId);
  if (user && event) {
    await sendEmailConfirmation(event, user)
  }

  return {
    success: true,
    message: "Success, email has been sent.",
  }
}

export async function DeleteEventParticipantAction(formData: FormData): Promise<void> {
  const participantId = formData.get("participantId");
  await db.delete(participant).where(eq(participant.id, Number(participantId)))
  revalidatePath('/', 'layout');
}

export async function createParticipant(formData: InsertParticipantType) : Promise<ActionResponse> {
  const validate = participantInsertSchema.safeParse(formData)
  if (!validate.success) {
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(validate.error),
      fields: validate.data,
    }
  }

  try {
    await db.insert(participant).values(validate.data).returning()
  } catch {
    return {
      success: false,
      message: "You are already registered for this event.",
    }
  }

  return  {
    success: true,
    message: "Success, "
  }
}

export async function updateParticipant(formData: UpdateParticipantType) : Promise<ActionResponse> {
  await db.update(participant).set(formData).where(eq(participant.id, Number(formData.id)))
  return {
    success: true,
    message: "Success, "
  }
}

export async function updateParticipantStatus(formData: UpdateParticipantType) : Promise<ActionResponse> {
  await db.update(participant).set(formData).where(eq(participant.id, Number(formData.id)))
  revalidatePath('/', 'layout');
  return {
    success: true,
    message: "Success, "
  }
}