import {doublePrecision, integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {EventSchema} from "@/db/schema/event-schema";

export const eventCategory = pgTable("event_category", {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text(),
  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, { onDelete: "cascade" }),

  price: doublePrecision('price'),
  currency: text("currency"),
  serviceFee: doublePrecision("service_fee").default(0),
  maxParticipants: integer("max_participants").default(50), // NULL = unlimited
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type EventCategoryType = typeof eventCategory.$inferSelect