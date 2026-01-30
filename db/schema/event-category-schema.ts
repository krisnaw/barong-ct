import {integer, pgTable, serial, text} from "drizzle-orm/pg-core";
import {EventSchema} from "@/db/schema/event-schema";

export const eventCategory = pgTable("event_category", {
  id: serial('id').primaryKey(),
  name: text('name'),
  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, { onDelete: "cascade" }),
});

export type EventCategoryType = typeof eventCategory.$inferSelect