import {date, pgTable, text} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/auth-schema";

export const userDetail = pgTable("user_detail", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, {onDelete: "cascade"}),

  phoneNumber: text("phone_number"),
  identityNumber: text("identity_number"),
  nationality: text("nationality"),
  gender: text("gender"),
  bloodType: text("blood_type"),
  dateOfBirth: date("date_of_birth"),

  instagram: text("instagram"),
  strava: text("strava"),

  emergencyContactName: text("emergency_contact_name"),
  emergencyContactNumber: text("emergency_contact_number"),

  countryOfResidence: text("country_of_residence"),
  province: text("province"),
  city: text("city"),
  postalCode: text("postal_code"),
  address: text("address"),
});

export type UserDetailType = typeof userDetail.$inferSelect