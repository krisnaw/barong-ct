ALTER TABLE "event_payment" DROP CONSTRAINT "event_payment_order_id_event_order_id_fk";
--> statement-breakpoint
ALTER TABLE "event_payment" ADD COLUMN "event_participant" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "event_payment" ADD CONSTRAINT "event_payment_event_participant_event_participant_id_fk" FOREIGN KEY ("event_participant") REFERENCES "public"."event_participant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_payment" DROP COLUMN "order_id";