ALTER TABLE "event_order" ADD COLUMN "promo_id" integer;--> statement-breakpoint
ALTER TABLE "event_order" ADD COLUMN "promo_code" text;--> statement-breakpoint
ALTER TABLE "event_order" ADD COLUMN "discount_amount" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event_order" ADD COLUMN "final_price" double precision;--> statement-breakpoint
ALTER TABLE "event_order" ADD CONSTRAINT "event_order_promo_id_event_promo_id_fk" FOREIGN KEY ("promo_id") REFERENCES "public"."event_promo"("id") ON DELETE set null ON UPDATE no action;