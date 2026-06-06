import {doublePrecision, integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {EventSchema} from "@/db/schema/event-schema";
import {createInsertSchema, createUpdateSchema} from "drizzle-zod";
import {relations} from "drizzle-orm";
import {participant} from "@/db/schema/participant-schema";

export const eventCategory = pgTable("event_category", {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text(),
  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, { onDelete: "cascade" }),

  price: doublePrecision('price').default(0),
  currency: text("currency").default('IDR'),
  serviceFee: doublePrecision("service_fee").default(0),
  maxParticipants: integer("max_participants").default(50), // NULL = unlimited
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type EventCategoryType = typeof eventCategory.$inferSelect
export type InsertCategoryType = typeof eventCategory.$inferInsert
export type UpdateCategoryType = Partial<typeof eventCategory.$inferInsert>;
export const EventCategoryInsertSchema = createInsertSchema(eventCategory);
export const EventCategoryUpdateSchema = createUpdateSchema(eventCategory).omit({
  eventId: true
})


export const categoriesRelations = relations(eventCategory, ({ one, many }) => ({
  event: one(EventSchema, {
    fields: [eventCategory.eventId],
    references: [EventSchema.id],
  }),
  participants: many(participant),
}));