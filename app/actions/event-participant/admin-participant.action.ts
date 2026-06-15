'use server'

import {db} from "@/db/db";
import {participant, user, userDetail} from "@/db/schema";
import {eq} from "drizzle-orm";
import {checkParticipantByEvent} from "@/db/query/participant-query";
import {getCategoryById} from "@/db/query/event-category.query";
import {getPromoById} from "@/db/query/event-promo.query";
import {processFreePass} from "@/app/actions/payment/freepass.action";
import {auth} from "@/lib/auth";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {revalidatePath} from "next/cache";
import {AdminRegisterState} from "@/app/actions/event-participant/event-participant.action";

export type AdminRegisterFreePassParams = {
  name: string
  email: string
  categoryId: number
  eventId: number
  promoId: number
  groupId?: number | null
  jerseySize?: string | null
  gender?: string | null
  bloodType?: string | null
  dateOfBirth?: string | null
  identityNumber?: string | null
  city?: string | null
  emergencyContactName?: string | null
  emergencyPhone?: string | null
  phone?: string | null
}

export async function adminRegisterFreePass(
  params: AdminRegisterFreePassParams
): Promise<AdminRegisterState> {
  const { name, email, categoryId, eventId, promoId, groupId, jerseySize,
    gender, bloodType, dateOfBirth, identityNumber, city, emergencyContactName, emergencyPhone, phone } = params

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

  // 3. Upsert userDetail — processFreePass reads gender from here to generate the bib number
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

  // 4. Resolve pricing and verify free-pass
  const category = await getCategoryById(categoryId)
  if (!category) {
    return { success: false, message: 'Category not found.' }
  }

  const promo = await getPromoById(promoId)
  if (!promo) {
    return { success: false, message: 'Promo not found.' }
  }

  const price = Number(category.price ?? 0)
  const discount = promo.discountType === 'percentage'
    ? price * (promo.discountValue / 100)
    : promo.discountValue

  if (discount < price) {
    return { success: false, message: 'Promo does not cover the full price.' }
  }

  // 5. Insert participant
  const [newParticipant] = await db.insert(participant).values({
    userId: existingUser.id,
    eventId,
    categoryId,
    groupId: groupId ?? null,
    jerseySize: jerseySize ?? null,
    promoId,
    promoCode: promo.promo,
    discountAmount: discount,
    price,
    serviceFee: 0,
    finalPrice: 0,
    status: PARTICIPANT_STATUS.PENDING_PAYMENT,
  }).returning()

  // 6. Delegate to processFreePass — assigns bib, creates zero-value payment record, marks COMPLETED
  const freePassRes = await processFreePass({
    participantId: newParticipant.id,
    promoId,
    discountAmount: discount,
  })

  if (!freePassRes.success) {
    return { success: false, message: freePassRes.message }
  }

  revalidatePath('/', 'layout')

  return {
    success: true,
    message: 'Participant registered successfully.',
    participantId: newParticipant.id,
  }
}
