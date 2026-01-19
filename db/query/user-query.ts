'use server'

import {user} from "@/db/schema";
import {UserWithDetail} from "@/types/auth-types";
import {db} from "@/db/db";
import {desc, eq, ilike} from "drizzle-orm";

export async function getUsers( name?  : string) {
  return db.select().from(user)
    .where(name ? ilike(user.name, `%${name}%`) : undefined)
    .orderBy(desc(user.createdAt))
    .limit(100);
}

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