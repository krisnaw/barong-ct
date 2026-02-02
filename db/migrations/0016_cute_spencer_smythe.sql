CREATE TABLE "event_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft',
	"event_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"event_category_id" integer,
	"event_group_id" integer,
	"jersey_gender" text,
	"jersey_size" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_group" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event_order" ADD CONSTRAINT "event_order_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_order" ADD CONSTRAINT "event_order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_order" ADD CONSTRAINT "event_order_event_category_id_event_category_id_fk" FOREIGN KEY ("event_category_id") REFERENCES "public"."event_category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_order" ADD CONSTRAINT "event_order_event_group_id_event_group_id_fk" FOREIGN KEY ("event_group_id") REFERENCES "public"."event_group"("id") ON DELETE set null ON UPDATE no action;