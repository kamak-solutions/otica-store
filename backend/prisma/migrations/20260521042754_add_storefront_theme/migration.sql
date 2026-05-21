-- CreateTable
CREATE TABLE "StorefrontTheme" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'default',
    "primaryColor" TEXT NOT NULL DEFAULT '#6F330B',
    "secondaryColor" TEXT NOT NULL DEFAULT '#E75900',
    "accentColor" TEXT NOT NULL DEFAULT '#B8914B',
    "backgroundColor" TEXT NOT NULL DEFAULT '#F9F4EF',
    "surfaceColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "titleColor" TEXT NOT NULL DEFAULT '#2C2520',
    "textColor" TEXT NOT NULL DEFAULT '#7F7169',
    "borderColor" TEXT NOT NULL DEFAULT '#E7D8CC',
    "buttonTextColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorefrontTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StorefrontTheme_key_key" ON "StorefrontTheme"("key");
