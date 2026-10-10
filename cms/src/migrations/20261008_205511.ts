import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "site_settings_home_join_paragraphs" ADD CONSTRAINT "site_settings_home_join_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_team_paragraphs" ADD CONSTRAINT "site_settings_about_team_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_home_join_paragraphs_order_idx" ON "site_settings_home_join_paragraphs" USING btree ("_order");
  CREATE INDEX "site_settings_home_join_paragraphs_parent_id_idx" ON "site_settings_home_join_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_team_paragraphs_order_idx" ON "site_settings_about_team_paragraphs" USING btree ("_order");
  CREATE INDEX "site_settings_about_team_paragraphs_parent_id_idx" ON "site_settings_about_team_paragraphs" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_home_join_paragraphs" CASCADE;
  DROP TABLE "site_settings_about_team_paragraphs" CASCADE;
  DROP TABLE "site_settings" CASCADE;`)
}
