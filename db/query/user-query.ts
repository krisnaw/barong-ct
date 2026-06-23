'use server'

import {user, userDetail} from "@/db/schema";
import {UserWithDetail} from "@/types/auth-types";
import {db} from "@/db/db";
import {desc, eq, getTableColumns} from "drizzle-orm";

export async function getUsers() {
  return db.select({
    ...getTableColumns(user), phone: userDetail.phoneNumber
  }).from(user)
    .leftJoin(userDetail, eq(userDetail.userId, user.id))
    .orderBy(desc(user.createdAt))
    .limit(150);
}

export async function getUserById(userId: string) {
  return db.query.user.findFirst({where: eq(user.id, userId)})
}

export async function getUserDetail(userId: string) {
  return db.query.userDetail.findFirst({where: eq(userDetail.userId, userId)})
}

export async function getUserWithDetail(id: string): Promise<UserWithDetail> {
  const userDetail = await db.query.user.findFirst({
    where: eq(user.id, id),
    with: {
      detail: true
    }
  })

  return userDetail as UserWithDetail;
}