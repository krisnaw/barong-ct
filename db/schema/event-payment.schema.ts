import {doublePrecision, integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {eventOrder} from "@/db/schema/event-order.schema";

export const eventPayment = pgTable("event_payment", {
  id: serial('id').primaryKey(),

  status: text("status").default('pending'),

  orderId: integer("order_id")
    .notNull()
    .references(() => eventOrder.id, {onDelete: "cascade"}),

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

export type EventPaymentType = typeof eventPayment.$inferSelect