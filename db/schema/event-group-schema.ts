import {integer, pgTable, serial, text} from "drizzle-orm/pg-core";
import {EventSchema} from "@/db/schema/event-schema";
import {eventCategory} from "@/db/schema/event-category-schema";

export const eventGroup = pgTable("event_group", {
  id: serial('id').primaryKey(),

  name: text('name').notNull(),

  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, { onDelete: "cascade" }),

  eventCategoryId: integer("event_category_id")
    .references(() => eventCategory.id, { onDelete: "set null" }),
});


export type EventGroupType = typeof eventGroup.$inferSelect