'use server'

import {ActionResponse} from "@/types/types";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "@/db/db";
import {participant} from "@/db/schema";

export async function joinEventAction(payload: {  eventId: string }) : Promise<ActionResponse> {

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  if (!session) {
    redirect("/auth/signup")
  }

  try {
    await db.insert(participant).values({
      userId: session.user.id,
      eventId: Number(payload.eventId),
    }).onConflictDoNothing()
  } catch (error) {
    console.log(error);
  }

  return {
    success: true,
    message: "Success, you have joined this event",
  }
}

export async function DeleteEventParticipantAction() {

}