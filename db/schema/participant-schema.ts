import {doublePrecision, integer, pgTable, serial, text, timestamp, unique, uniqueIndex} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/auth-schema";
import {EventSchema} from "@/db/schema/event-schema";
import {relations} from "drizzle-orm";
import {User} from "@/types/auth-types";
import {createInsertSchema} from "drizzle-zod";
import {eventCategory} from "@/db/schema/event-category-schema";
import {eventGroup} from "@/db/schema/event-group-schema";
import {eventPromoSchema} from "@/db/schema/event-promo.schema";
import {eventPayment} from "@/db/schema/event-payment.schema";

export const participant = pgTable("event_participant", {
  id: serial('id').primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, { onDelete: "cascade" }),

  bibNumber: text("bib_id"),
  status: text("status").default('draft'),

  categoryId: integer("event_category_id")
    .references(() => eventCategory.id, {onDelete: "set null"}),
  groupId: integer("event_group_id")
    .references(() => eventGroup.id, {onDelete: "set null"}),

  price: doublePrecision('price').default(0),
  serviceFee: doublePrecision('service_fee').default(0),
  currency: text("currency").default("IDR"),

  promoId: integer("promo_id")
    .references(() => eventPromoSchema.id, {onDelete: "set null"}),
  promoCode: text('promo_code'),
  discountAmount: doublePrecision('discount_amount').default(0),
  finalPrice: doublePrecision('final_price').default(0),

  jerseySize: text("jersey_size"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (t) => ({
  userEventUnique: uniqueIndex("user_event_unique").on(t.userId, t.eventId),
  // Bib number must be unique per event
  uniqueBibPerEvent: unique().on(
    t.eventId,
    t.bibNumber
  ),
}))

export const participantRelations = relations(participant, ({ one, many }) => ({
  event: one(EventSchema, {
    fields: [participant.eventId],
    references: [EventSchema.id],
  }),
  user: one(user, {
    fields: [participant.userId],
    references: [user.id],
  }),
  category: one(eventCategory, {
    fields: [participant.categoryId],
    references: [eventCategory.id],
  }),
  group: one(eventGroup, {
    fields: [participant.groupId],
    references: [eventGroup.id],
  }),
  payments: many(eventPayment),
}));

export type ParticipantType = typeof participant.$inferSelect
export type InsertParticipantType = typeof participant.$inferInsert;
export type UpdateParticipantType = Partial<typeof participant.$inferInsert> & {
  id: typeof participant.$inferInsert.id;
}

export const participantInsertSchema = createInsertSchema(participant);

export type ParticipantWithUser = ParticipantType & {
  user : User
}