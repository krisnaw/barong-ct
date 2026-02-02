import {doublePrecision, integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {EventSchema} from "@/db/schema/event-schema";
import {user} from "@/db/schema/auth-schema";

export const eventPayment = pgTable("event_payment", {
  id: serial('id').primaryKey(),

  status: text("status").default('pending'),

  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, {onDelete: "cascade"}),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  invoiceNumber: integer("invoice_number"),

  price: doublePrecision('price'),
  currency: text("currency"),

  paymentURL: text("payment_url"),
  expiresAt: timestamp("expired_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});