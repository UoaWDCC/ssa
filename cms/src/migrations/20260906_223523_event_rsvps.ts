import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_event_registrations_gender" AS ENUM('woman', 'man', 'non-binary', 'not-say');
  CREATE TYPE "public"."enum_event_registrations_university_year" AS ENUM('1', '2', '3', '4', '5+', 'postgraduate', 'not-currently-studying');
  CREATE TYPE "public"."enum_event_registrations_price_type" AS ENUM('member', 'non-member');
  CREATE TYPE "public"."enum_event_registrations_currency" AS ENUM('nzd');
  CREATE TYPE "public"."enum_event_registrations_status" AS ENUM('pending', 'paid', 'cancelled', 'refunded');
  CREATE TABLE "event_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"user_id" integer,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"emergency_contact_name" varchar NOT NULL,
  	"emergency_contact_phone" varchar NOT NULL,
  	"emergency_contact_relationship" varchar NOT NULL,
  	"gender" "enum_event_registrations_gender" NOT NULL,
  	"dietary_requirements" varchar NOT NULL,
  	"university_year" "enum_event_registrations_university_year" NOT NULL,
  	"price_type" "enum_event_registrations_price_type" NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" "enum_event_registrations_currency" DEFAULT 'nzd' NOT NULL,
  	"status" "enum_event_registrations_status" DEFAULT 'pending' NOT NULL,
  	"stripe_checkout_session_id" varchar,
  	"stripe_payment_intent_id" varchar,
  	"paid_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "events" ADD COLUMN "time" timestamp(3) with time zone;
  ALTER TABLE "events" ADD COLUMN "location" varchar;
  ALTER TABLE "events" ADD COLUMN "member_price" numeric;
  ALTER TABLE "events" ADD COLUMN "non_member_price" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "event_registrations_id" integer;
  ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "event_registrations_event_idx" ON "event_registrations" USING btree ("event_id");
  CREATE INDEX "event_registrations_user_idx" ON "event_registrations" USING btree ("user_id");
  CREATE INDEX "event_registrations_email_idx" ON "event_registrations" USING btree ("email");
  CREATE INDEX "event_registrations_status_idx" ON "event_registrations" USING btree ("status");
  CREATE UNIQUE INDEX "event_registrations_stripe_checkout_session_id_idx" ON "event_registrations" USING btree ("stripe_checkout_session_id");
  CREATE UNIQUE INDEX "event_registrations_stripe_payment_intent_id_idx" ON "event_registrations" USING btree ("stripe_payment_intent_id");
  CREATE INDEX "event_registrations_updated_at_idx" ON "event_registrations" USING btree ("updated_at");
  CREATE INDEX "event_registrations_created_at_idx" ON "event_registrations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_registrations_fk" FOREIGN KEY ("event_registrations_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_event_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("event_registrations_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "event_registrations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_event_registrations_fk";
  DROP TABLE "event_registrations" CASCADE;
  
  DROP INDEX "payload_locked_documents_rels_event_registrations_id_idx";
  ALTER TABLE "events" DROP COLUMN "time";
  ALTER TABLE "events" DROP COLUMN "location";
  ALTER TABLE "events" DROP COLUMN "member_price";
  ALTER TABLE "events" DROP COLUMN "non_member_price";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "event_registrations_id";
  DROP TYPE "public"."enum_event_registrations_gender";
  DROP TYPE "public"."enum_event_registrations_university_year";
  DROP TYPE "public"."enum_event_registrations_price_type";
  DROP TYPE "public"."enum_event_registrations_currency";
  DROP TYPE "public"."enum_event_registrations_status";`)
}
