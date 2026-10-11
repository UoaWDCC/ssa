import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// IF EXISTS guards: prod drifted from a dev schema push, so some columns may already be gone.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "event_registrations" ALTER COLUMN "phone" DROP NOT NULL;
  ALTER TABLE "event_registrations" DROP COLUMN IF EXISTS "price_type";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "non_member_price";
  DROP TYPE IF EXISTS "public"."enum_event_registrations_price_type";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_event_registrations_price_type" AS ENUM('member', 'non-member');
  ALTER TABLE "events" ADD COLUMN "non_member_price" numeric;
  ALTER TABLE "event_registrations" ADD COLUMN "price_type" "enum_event_registrations_price_type" DEFAULT 'member' NOT NULL;
  ALTER TABLE "event_registrations" ALTER COLUMN "phone" SET NOT NULL;`)
}
