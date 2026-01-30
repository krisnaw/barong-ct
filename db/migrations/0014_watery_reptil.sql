CREATE TABLE "event_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"event_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_category" ADD CONSTRAINT "event_category_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;