import {date, pgTable, text} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/auth-schema";

export const userDetail = pgTable("user_detail", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, {onDelete: "cascade"}),

  date_of_birth: date("date_of_birth"),

  phoneNumber: text("phone_number"),

  instagram: text("instagram"),
  strava: text("strava"),

  emergency_contact_name: text("emergency_contact_name"),
  emergency_contact_number: text("emergency_contact_number"),
});