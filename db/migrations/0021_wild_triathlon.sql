CREATE TABLE "event_promo" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"promo" text NOT NULL,
	"discount_value" double precision NOT NULL,
	"currency" text DEFAULT 'IDR',
	"starts_at" timestamp,
	"ends_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_promo" ADD CONSTRAINT "event_promo_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;