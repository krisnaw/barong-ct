CREATE TABLE "user_detail" (
	"user_id" text PRIMARY KEY NOT NULL,
	"date_of_birth" date,
	"phone_number" text,
	"instagram" text,
	"strava" text,
	"emergency_contact_name" text,
	"emergency_contact_number" text
);
--> statement-breakpoint
ALTER TABLE "user_detail" ADD CONSTRAINT "user_detail_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;