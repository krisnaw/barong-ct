ALTER TABLE "event" ADD COLUMN "service_fee" double precision DEFAULT 5000;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "registration_closes_at" timestamp;