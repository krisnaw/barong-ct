import {date, pgTable, text} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/auth-schema";

export const userDetail = pgTable("user_detail", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, {onDelete: "cascade"}),

  identity_number: text("identity_number"),
  address: text("address"),
  blood_type: text("blood_type"),

  dateOfBirth: date("date_of_birth"),

  phoneNumber: text("phone_number"),

  instagram: text("instagram"),
  strava: text("strava"),

  emergencyContactName: text("emergency_contact_name"),
  emergencyContactNumber: text("emergency_contact_number"),
});

export type UserDetailType = typeof userDetail.$inferSelect