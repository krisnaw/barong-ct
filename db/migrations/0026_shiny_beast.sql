ALTER TABLE "event_category" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "event_category" ADD COLUMN "price" double precision;--> statement-breakpoint
ALTER TABLE "event_category" ADD COLUMN "currency" text;--> statement-breakpoint
ALTER TABLE "event_category" ADD COLUMN "service_fee" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event_category" ADD COLUMN "max_participants" integer DEFAULT 50;--> statement-breakpoint
ALTER TABLE "event_category" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "event_category" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "max_participants";