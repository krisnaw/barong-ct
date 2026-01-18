ALTER TABLE "event_participant" ADD COLUMN "bib_id" integer;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "status" text DEFAULT 'registered';--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_id_bib_id_unique" UNIQUE("event_id","bib_id");