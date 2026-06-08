ALTER TABLE "event_promo" ADD COLUMN "usage_limit" integer;--> statement-breakpoint
ALTER TABLE "event_promo" ADD COLUMN "used_count" integer DEFAULT 0 NOT NULL;