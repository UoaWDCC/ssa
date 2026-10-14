import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_rsvp_questions_field_key" AS ENUM('custom', 'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship', 'gender', 'dietaryRequirements', 'universityYear');
  CREATE TYPE "public"."enum_events_rsvp_questions_type" AS ENUM('text', 'textarea', 'email', 'tel', 'number', 'select', 'checkbox');
  CREATE TYPE "public"."enum_events_rsvp_questions_step" AS ENUM('emergency', 'attendee');
  CREATE TYPE "public"."enum_sponsors_category" AS ENUM('FOOD', 'RETAIL', 'SERVICES', 'ENTERTAINMENT');
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
  
  CREATE TABLE "site_settings_home_join_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_about_team_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_join_title" varchar DEFAULT 'Join SSA',
  	"about_hero_title" varchar DEFAULT 'ABOUT US',
  	"about_hero_subtitle" varchar DEFAULT 'We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)',
  	"about_team_title" varchar DEFAULT 'Meet the SSA Team',
  	"events_hero_title" varchar DEFAULT 'EVENTS',
  	"events_hero_subtitle" varchar DEFAULT 'Join us for exciting events, cultural celebrations, and community gatherings throughout the year.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "event_registrations" ALTER COLUMN "phone" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_name" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_phone" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_relationship" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "gender" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "dietary_requirements" DROP NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "university_year" DROP NOT NULL;
  ALTER TABLE "event_registrations" ADD COLUMN "answers" jsonb DEFAULT '[]'::jsonb NOT NULL;
  ALTER TABLE "sponsors" ADD COLUMN "category" "enum_sponsors_category" DEFAULT 'FOOD' NOT NULL;
  ALTER TABLE "events_rsvp_questions_options" ADD CONSTRAINT "events_rsvp_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_rsvp_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rsvp_questions" ADD CONSTRAINT "events_rsvp_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_home_join_paragraphs" ADD CONSTRAINT "site_settings_home_join_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_team_paragraphs" ADD CONSTRAINT "site_settings_about_team_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_rsvp_questions_options_order_idx" ON "events_rsvp_questions_options" USING btree ("_order");
  CREATE INDEX "events_rsvp_questions_options_parent_id_idx" ON "events_rsvp_questions_options" USING btree ("_parent_id");
  CREATE INDEX "events_rsvp_questions_order_idx" ON "events_rsvp_questions" USING btree ("_order");
  CREATE INDEX "events_rsvp_questions_parent_id_idx" ON "events_rsvp_questions" USING btree ("_parent_id");
  CREATE INDEX "site_settings_home_join_paragraphs_order_idx" ON "site_settings_home_join_paragraphs" USING btree ("_order");
  CREATE INDEX "site_settings_home_join_paragraphs_parent_id_idx" ON "site_settings_home_join_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_team_paragraphs_order_idx" ON "site_settings_about_team_paragraphs" USING btree ("_order");
  CREATE INDEX "site_settings_about_team_paragraphs_parent_id_idx" ON "site_settings_about_team_paragraphs" USING btree ("_parent_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_rsvp_questions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_rsvp_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_home_join_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_about_team_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_rsvp_questions_options" CASCADE;
  DROP TABLE "events_rsvp_questions" CASCADE;
  DROP TABLE "site_settings_home_join_paragraphs" CASCADE;
  DROP TABLE "site_settings_about_team_paragraphs" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "event_registrations" ALTER COLUMN "phone" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_name" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_phone" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "emergency_contact_relationship" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "gender" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "dietary_requirements" SET NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "university_year" SET NOT NULL;
  ALTER TABLE "event_registrations" DROP COLUMN "answers";
  ALTER TABLE "sponsors" DROP COLUMN "category";
  DROP TYPE "public"."enum_events_rsvp_questions_field_key";
  DROP TYPE "public"."enum_events_rsvp_questions_type";
  DROP TYPE "public"."enum_events_rsvp_questions_step";
  DROP TYPE "public"."enum_sponsors_category";`)
}
