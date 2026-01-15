import {date, pgTable, serial, text, time, timestamp} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";

export const EventSchema = pgTable("event", {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  feature_image: text("feature_image"),

  startDate: timestamp("start_date").defaultNow().notNull(),

  eventDate: date(),
  eventTime: time({ withTimezone: true }),

  locationName: text("location_name"),
  locationLink: text("location_link"), // Link to google maps

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export type EventType = typeof EventSchema.$inferSelect
export const EventInsertSchema = createInsertSchema(EventSchema);