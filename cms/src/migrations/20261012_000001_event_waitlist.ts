import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_event_registrations_status" ADD VALUE IF NOT EXISTS 'waitlisted' BEFORE 'paid';
    ALTER TYPE "public"."enum_event_registrations_status" ADD VALUE IF NOT EXISTS 'offered' BEFORE 'paid';
    ALTER TABLE "events" ADD COLUMN "capacity" numeric;
    ALTER TABLE "event_registrations" ADD COLUMN "offer_version" numeric DEFAULT 0;
    ALTER TABLE "event_registrations" ADD COLUMN "stripe_invoice_id" varchar;
    ALTER TABLE "event_registrations" ADD COLUMN "stripe_invoice_url" varchar;
    ALTER TABLE "event_registrations" ADD COLUMN "offered_at" timestamp(3) with time zone;
    ALTER TABLE "event_registrations" ADD COLUMN "offer_due_at" timestamp(3) with time zone;
    CREATE UNIQUE INDEX "event_registrations_stripe_invoice_id_idx"
      ON "event_registrations" USING btree ("stripe_invoice_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Refuse to discard live offers: withdrawing them in the CMS first voids their
  // Stripe invoices, which a database rollback cannot do on its own.
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM "event_registrations" WHERE "status"::text = 'offered') THEN
        RAISE EXCEPTION 'Withdraw active waitlist offers before rolling back this migration';
      END IF;
    END $$;
    ALTER TABLE "event_registrations" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "event_registrations" ALTER COLUMN "status" TYPE varchar USING "status"::text;
    UPDATE "event_registrations" SET "status" = 'cancelled' WHERE "status" = 'waitlisted';
    DROP TYPE "public"."enum_event_registrations_status";
    CREATE TYPE "public"."enum_event_registrations_status" AS ENUM ('pending', 'paid', 'cancelled', 'refunded');
    ALTER TABLE "event_registrations" ALTER COLUMN "status" TYPE "public"."enum_event_registrations_status"
      USING "status"::"public"."enum_event_registrations_status";
    ALTER TABLE "event_registrations" ALTER COLUMN "status" SET DEFAULT 'pending';
    DROP INDEX "event_registrations_stripe_invoice_id_idx";
    ALTER TABLE "event_registrations" DROP COLUMN "offer_version", DROP COLUMN "stripe_invoice_id",
      DROP COLUMN "stripe_invoice_url", DROP COLUMN "offered_at", DROP COLUMN "offer_due_at";
    ALTER TABLE "events" DROP COLUMN "capacity";
  `)
}
