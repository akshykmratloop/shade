/*
  Warnings:

  - The values [CAREER_POST] on the enum `SectionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SectionType_new" AS ENUM ('HERO_BANNER', 'CARD_GRID', 'STATISTICS', 'TESTIMONIALS', 'CLIENT_LOGOS', 'CONTACT_FORM', 'MARKDOWN_CONTENT', 'SERVICE_CARDS', 'PROJECT_GRID', 'TEAM', 'CLIENTS', 'MARKETS', 'CAREER_LISTING', 'NEWS_FEED', 'FOOTER_COLUMNS', 'HEADER_NAV', 'SERVICE_DETAIL', 'CAREER_DETAILS', 'NEWS_DETAIL', 'CONTACT_INFO', 'TESTIMONIAL');
ALTER TABLE "Section" ALTER COLUMN "SectionType" TYPE "SectionType_new" USING ("SectionType"::text::"SectionType_new");
ALTER TYPE "SectionType" RENAME TO "SectionType_old";
ALTER TYPE "SectionType_new" RENAME TO "SectionType";
DROP TYPE "SectionType_old";
COMMIT;
