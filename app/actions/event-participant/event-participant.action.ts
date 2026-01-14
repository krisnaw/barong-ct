'use server'

import {ActionResponse} from "@/types/types";

export async function CreateEventParticipantAction() : Promise<ActionResponse> {
  return {
    success: true,
    message: ''
  }
}

export async function DeleteEventParticipantAction() {

}