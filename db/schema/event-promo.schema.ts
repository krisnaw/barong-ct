import {boolean, doublePrecision, integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {EventSchema} from "@/db/schema/event-schema";
import {createInsertSchema} from "drizzle-zod";

export const eventPromoSchema = pgTable("event_promo", {
  id: serial('id').primaryKey(),

  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, {onDelete: "cascade"}),

  promo: text("promo").notNull(),
  discountValue: doublePrecision('discount_value').notNull(),
  currency: text("currency").default("IDR"),

  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  isActive: boolean('is_active').default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export type PromoType = typeof eventPromoSchema.$inferSelect
export const promoInsertSchema = createInsertSchema(eventPromoSchema);