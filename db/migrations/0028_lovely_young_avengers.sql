ALTER TABLE "event_participant" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "event_category_id" integer;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "event_group_id" integer;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "price" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "service_fee" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "currency" text DEFAULT 'IDR';--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "promo_id" integer;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "promo_code" text;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "discount_amount" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "final_price" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "jersey_size" text;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_category_id_event_category_id_fk" FOREIGN KEY ("event_category_id") REFERENCES "public"."event_category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_group_id_event_group_id_fk" FOREIGN KEY ("event_group_id") REFERENCES "public"."event_group"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_promo_id_event_promo_id_fk" FOREIGN KEY ("promo_id") REFERENCES "public"."event_promo"("id") ON DELETE set null ON UPDATE no action;