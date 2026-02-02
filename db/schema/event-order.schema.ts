import {integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {EventSchema} from "@/db/schema/event-schema";
import {eventCategory} from "@/db/schema/event-category-schema";
import {eventGroup} from "@/db/schema/event-group-schema";
import {user} from "@/db/schema/auth-schema";

export const eventOrder = pgTable("event_order", {
  id: serial('id').primaryKey(),

  status: text("status").default('draft'),

  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, {onDelete: "cascade"}),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  categoryId: integer("event_category_id")
    .references(() => eventCategory.id, {onDelete: "set null"}),

  groupId: integer("event_group_id")
    .references(() => eventGroup.id, {onDelete: "set null"}),

  jerseyGender: text("jersey_gender"),
  jerseySize: text("jersey_size"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});