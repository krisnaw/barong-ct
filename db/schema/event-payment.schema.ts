import {doublePrecision, integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {participant} from "@/db/schema/participant-schema";

export const eventPayment = pgTable("event_payment", {
  id: serial('id').primaryKey(),

  status: text("status").default('pending'),

  participantId: integer("event_participant")
    .notNull()
    .references(() => participant.id, {onDelete: "cascade"}),

  invoiceNumber: text("invoice_number"),
  expiresAt: timestamp("expires_at", {withTimezone: true}),

  price: doublePrecision('price'),
  currency: text("currency"),

  paymentURL: text("payment_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const eventPaymentRelations = relations(eventPayment, ({ one }) => ({
  participant: one(participant, {
    fields: [eventPayment.participantId],
    references: [participant.id],
  }),
}));

export type EventPaymentType = typeof eventPayment.$inferSelect
export type EventPaymentInsert = Omit<EventPaymentType, 'id' | 'createdAt' | 'updatedAt'>