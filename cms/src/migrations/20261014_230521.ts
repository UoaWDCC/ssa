import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_rsvp_questions_field_key" AS ENUM('custom', 'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship', 'gender', 'dietaryRequirements', 'universityYear');
  CREATE TYPE "public"."enum_events_rsvp_questions_type" AS ENUM('text', 'textarea', 'email', 'tel', 'number', 'select', 'checkbox');
  CREATE TYPE "public"."enum_events_rsvp_questions_step" AS ENUM('emergency', 'attendee');
  CREATE TABLE "events_rsvp_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "events_rsvp_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_key" "enum_events_rsvp_questions_field_key" DEFAULT 'custom' NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_events_rsvp_questions_type" DEFAULT 'text' NOT NULL,
  	"step" "enum_events_rsvp_questions_step" DEFAULT 'attendee' NOT NULL,
  	"placeholder" varchar,
  	"required" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true
  );
  
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_name" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_phone" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_relationship" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "gender" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "dietary_requirements" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "university_year" DROP NOT NULL;
  ALTER TABLE "event_registrations" ADD COLUMN "answers" jsonb DEFAULT '[]'::jsonb NOT NULL;
  ALTER TABLE "events_rsvp_questions_options" ADD CONSTRAINT "events_rsvp_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_rsvp_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rsvp_questions" ADD CONSTRAINT "events_rsvp_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_rsvp_questions_options_order_idx" ON "events_rsvp_questions_options" USING btree ("_order");
  CREATE INDEX "events_rsvp_questions_options_parent_id_idx" ON "events_rsvp_questions_options" USING btree ("_parent_id");
  CREATE INDEX "events_rsvp_questions_order_idx" ON "events_rsvp_questions" USING btree ("_order");
  CREATE INDEX "events_rsvp_questions_parent_id_idx" ON "events_rsvp_questions" USING btree ("_parent_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_rsvp_questions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_rsvp_questions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_rsvp_questions_options" CASCADE;
  DROP TABLE "events_rsvp_questions" CASCADE;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_name" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_phone" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_relationship" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "gender" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "dietary_requirements" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "university_year" SET NOT NULL;
  ALTER TABLE "event_registrations" DROP COLUMN "answers";
  DROP TYPE "public"."enum_events_rsvp_questions_field_key";
  DROP TYPE "public"."enum_events_rsvp_questions_type";
  DROP TYPE "public"."enum_events_rsvp_questions_step";`)
}
