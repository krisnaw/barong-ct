import {auth} from "@/lib/auth";
import {UserDetailType} from "@/db/schema";

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user

export type UserWithDetail = User & {
  detail: UserDetailType
}