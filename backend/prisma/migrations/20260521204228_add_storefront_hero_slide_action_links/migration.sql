-- AlterTable
ALTER TABLE "StorefrontHeroSlide" ADD COLUMN     "primaryActionHref" TEXT NOT NULL DEFAULT '/produtos',
ADD COLUMN     "secondaryActionHref" TEXT NOT NULL DEFAULT '/orcamento';
