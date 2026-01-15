'use server'

import {user} from "@/db/schema";
import {UserWithDetail} from "@/types/auth-types";
import {db} from "@/db/db";
import {eq} from "drizzle-orm";

export async function getUserWithDetail(id: string): Promise<UserWithDetail | undefined> {
  const userDetail = await db.query.user.findFirst({
    where: eq(user.id, id),
    with: {
      detail: true
    }
  })

  if (!userDetail) {
    return undefined
  }

  return userDetail as UserWithDetail;
}