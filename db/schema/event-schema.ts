import {boolean, date, doublePrecision, integer, pgTable, serial, text, time, timestamp} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";
import {relations} from "drizzle-orm";
import {participant} from "@/db/schema/participant-schema";
import {eventCategory} from "@/db/schema/event-category-schema";

export const EventSchema = pgTable("event", {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  feature_image: text("feature_image"),

  maxParticipants: integer("max_participants").default(50), // NULL = unlimited

  startDate: timestamp("start_date").defaultNow().notNull(),

  eventDate: date(),
  eventTime: time({ withTimezone: true }),

  isPaid: boolean('is_paid').default(false),
  price: doublePrecision('price'),
  currency: text("currency"),

  locationName: text("location_name"),
  locationLink: text("location_link"), // Link to google maps

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const eventRelations = relations(EventSchema, ({ many }) => ({
  participants: many(participant),
  categories: many(eventCategory),
}));

export type EventType = typeof EventSchema.$inferSelect
export const EventInsertSchema = createInsertSchema(EventSchema);