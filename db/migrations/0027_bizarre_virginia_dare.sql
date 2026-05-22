ALTER TABLE "event_category" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event_category" ALTER COLUMN "price" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event_category" ALTER COLUMN "currency" SET DEFAULT 'IDR';--> statement-breakpoint
ALTER TABLE "event_order" ADD COLUMN "service_fee" double precision DEFAULT 0;