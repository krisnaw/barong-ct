import {integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/auth-schema";
import {EventSchema} from "@/db/schema/event-schema";

export const participant = pgTable("event_participant", {
  id: serial('id').primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})