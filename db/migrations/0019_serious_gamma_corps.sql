CREATE TABLE "event_payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'pending',
	"order_id" integer NOT NULL,
	"invoice_number" text,
	"expires_at" timestamp with time zone,
	"price" double precision,
	"currency" text,
	"payment_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_payment" ADD CONSTRAINT "event_payment_order_id_event_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."event_order"("id") ON DELETE cascade ON UPDATE no action;