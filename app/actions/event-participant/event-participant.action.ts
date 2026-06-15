'use server'

import {ActionResponse} from "@/types/types";
import {db} from "@/db/db";
import {
  InsertParticipantType,
  participant,
  participantInsertSchema,
  UpdateParticipantType,
  user,
  userDetail
} from "@/db/schema";
import {getEventById} from "@/db/query/event-query";
import {revalidatePath} from "next/cache";
import {eq} from "drizzle-orm";
import {checkParticipantByEvent, getParticipantById} from "@/db/query/participant-query";
import {z} from "zod";
import {sendEmailConfirmation} from "@/service/participant.service";
import {getUserWithDetail} from "@/db/query/user-query";
import {getCategoryById} from "@/db/query/event-category.query";
import {getPromoById} from "@/db/query/event-promo.query";
import {createPayment} from "@/app/actions/payment/payment.action";
import {auth} from "@/lib/auth";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {generateBibNumber} from "@/utils/bib.helper";

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

export async function deleteParticipantAction(id: number): Promise<ActionResponse> {
  await db.delete(participant).where(eq(participant.id, id))
  revalidatePath('/', 'layout')
  return { success: true, message: 'Participant deleted successfully.' }
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

export type AdminRegisterState = {
  success: boolean
  message: string
  paymentUrl?: string
  participantId?: number
} | null

export async function adminRegisterParticipant(
  _prev: AdminRegisterState,
  formData: FormData
): Promise<AdminRegisterState> {
  const name = (formData.get('name') as string | null)?.trim()
  const email = (formData.get('email') as string | null)?.trim()
  const categoryId = Number(formData.get('categoryId'))
  const eventId = Number(formData.get('eventId'))

  if (!name || !email || !categoryId || !eventId) {
    return { success: false, message: 'Name, email, category and event are required.' }
  }

  const pm: string[] = JSON.parse((formData.get('pm') as string | null) ?? '[]')
  if (pm.length === 0) {
    return { success: false, message: 'Please select a payment method.' }
  }

  const groupId = formData.get('groupId') ? Number(formData.get('groupId')) : null
  const jerseySize = (formData.get('jerseySize') as string | null) || null
  const promoId = formData.get('promoId') ? Number(formData.get('promoId')) : null
  const gender = (formData.get('gender') as string | null) || null
  const bloodType = (formData.get('bloodType') as string | null) || null
  const dateOfBirth = (formData.get('dateOfBirth') as string | null) || null
  const identityNumber = (formData.get('identityNumber') as string | null) || null
  const city = (formData.get('city') as string | null) || null
  const emergencyContactName = (formData.get('emergencyContactName') as string | null) || null
  const emergencyPhone = (formData.get('emergencyPhone') as string | null) || null
  const phone = (formData.get('phone') as string | null) || null

  // 1. Resolve user — find by email or create
  let existingUser = await db.query.user.findFirst({ where: eq(user.email, email) })

  if (!existingUser) {
    const created = await auth.api.createUser({
      body: { name, email, role: 'user', password: crypto.randomUUID() },
    })
    existingUser = created.user as unknown as typeof existingUser
  }

  if (!existingUser) {
    return { success: false, message: 'Failed to resolve user account.' }
  }

  // 2. Guard duplicate registration
  const alreadyRegistered = await checkParticipantByEvent(eventId, existingUser.id)
  if (alreadyRegistered) {
    return { success: false, message: 'This participant is already registered for the event.' }
  }

  // 3. Upsert userDetail with profile fields
  await db.insert(userDetail)
    .values({
      userId: existingUser.id,
      phoneNumber: phone,
      gender,
      bloodType,
      dateOfBirth,
      identityNumber,
      city,
      emergencyContactName,
      emergencyContactNumber: emergencyPhone,
    })
    .onConflictDoUpdate({
      target: userDetail.userId,
      set: { phoneNumber: phone, gender, bloodType, dateOfBirth, identityNumber, city, emergencyContactName, emergencyContactNumber: emergencyPhone },
    })

  // 4. Resolve pricing
  const category = await getCategoryById(categoryId)
  if (!category) {
    return { success: false, message: 'Category not found.' }
  }

  const price = Number(category.price ?? 0)
  const fee = Number(category.serviceFee ?? 0)

  let discount = 0
  let promoCode: string | null = null

  if (promoId) {
    const promo = await getPromoById(promoId)
    if (promo) {
      promoCode = promo.promo
      discount = promo.discountType === 'percentage'
        ? price * (promo.discountValue / 100)
        : promo.discountValue
    }
  }

  const finalPrice = Math.max(0, price + fee - discount)

  // 5. Insert participant
  const [newParticipant] = await db.insert(participant).values({
    userId: existingUser.id,
    eventId,
    categoryId,
    groupId,
    jerseySize,
    promoId,
    promoCode,
    discountAmount: discount,
    price,
    serviceFee: fee,
    finalPrice,
    status: PARTICIPANT_STATUS.PENDING_PAYMENT,
  }).returning()

  // 6. Create DOKU payment link
  const paymentRes = await createPayment({
    participantId: newParticipant.id,
    pm,
  })

  if (!paymentRes.success) {
    return { success: false, message: paymentRes.message }
  }

  revalidatePath('/', 'layout')

  return {
    success: true,
    message: 'Participant registered successfully.',
    paymentUrl: paymentRes.data as string,
    participantId: newParticipant.id,
  }
}

export async function fixParticipantBibNumber(participantId: number): Promise<ActionResponse> {
  const existing = await getParticipantById(participantId)
  if (!existing) {
    return { success: false, message: 'Participant not found.' }
  }

  const detail = await db.query.userDetail.findFirst({
    where: eq(userDetail.userId, existing.userId),
    columns: { gender: true },
  })

  const gender = detail?.gender
  if (gender !== 'male' && gender !== 'female') {
    return { success: false, message: 'Cannot fix bib: gender on profile is not set or is unsupported.' }
  }

  const GENDER_PREFIX: Record<'male' | 'female', number> = { male: 1, female: 2 }
  const currentBib = existing.bibNumber
  if (currentBib && Math.floor(Number(currentBib) / 1000) === GENDER_PREFIX[gender]) {
    return { success: false, message: 'Bib number already matches the current gender profile.' }
  }

  const newBib = await generateBibNumber(gender, existing.eventId)

  await db.update(participant)
    .set({ bibNumber: newBib })
    .where(eq(participant.id, participantId))

  revalidatePath('/', 'layout')

  return { success: true, message: `Bib number updated to ${newBib}.` }
}