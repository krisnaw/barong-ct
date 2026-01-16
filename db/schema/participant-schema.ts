import {integer, pgTable, serial, text, timestamp, uniqueIndex} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/auth-schema";
import {EventSchema} from "@/db/schema/event-schema";
import {relations} from "drizzle-orm";
import {User} from "@/types/auth-types";

export const participant = pgTable("event_participant", {
  id: serial('id').primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  eventId: integer("event_id")
    .notNull()
    .references(() => EventSchema.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (t) => ({
  userEventUnique: uniqueIndex("user_event_unique").on(t.userId, t.eventId),
}))

export const userRelation = relations(participant, ({ one }) => ({
  user: one(user, {
    fields: [participant.userId],
    references: [user.id],
  }),
}));

export type ParticipantType = typeof participant.$inferSelect
export type ParticipantWithUser = ParticipantType & {
  user : User
}