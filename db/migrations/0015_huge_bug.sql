CREATE TABLE "event_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"event_id" integer NOT NULL,
	"event_category_id" integer
);
--> statement-breakpoint
ALTER TABLE "event_group" ADD CONSTRAINT "event_group_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_group" ADD CONSTRAINT "event_group_event_category_id_event_category_id_fk" FOREIGN KEY ("event_category_id") REFERENCES "public"."event_category"("id") ON DELETE set null ON UPDATE no action;