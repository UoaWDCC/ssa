import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_sponsors_category" AS ENUM('FOOD', 'RETAIL', 'SERVICES', 'ENTERTAINMENT');

    ALTER TABLE "public"."sponsors"
      ADD COLUMN "category" "public"."enum_sponsors_category" DEFAULT 'FOOD' NOT NULL;

    UPDATE "public"."sponsors"
      SET "category" = 'FOOD'
      WHERE "category" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "public"."sponsors" DROP COLUMN IF EXISTS "category";
    DROP TYPE IF EXISTS "public"."enum_sponsors_category";
  `)
}
