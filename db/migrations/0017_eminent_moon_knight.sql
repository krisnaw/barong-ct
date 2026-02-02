ALTER TABLE "event" ADD COLUMN "is_paid" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "price" double precision;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "currency" text;