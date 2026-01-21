'use server'

import {user, userDetail} from "@/db/schema";
import {UserWithDetail} from "@/types/auth-types";
import {db} from "@/db/db";
import {desc, eq, getTableColumns, ilike} from "drizzle-orm";

export async function getUsers( name?  : string) {
  return db.select({
    ...getTableColumns(user), phone: userDetail.phoneNumber
  }).from(user)
    .where(name ? ilike(user.name, `%${name}%`) : undefined)
    .leftJoin(userDetail, eq(userDetail.userId, user.id))
    .orderBy(desc(user.createdAt))
    .limit(150);
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