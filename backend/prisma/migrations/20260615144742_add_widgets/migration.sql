-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "mediaUrl" TEXT,
    "embedCode" TEXT,
    "redirectUrl" TEXT NOT NULL,
    "buttonLabel" TEXT,
    "aspectRatio" TEXT NOT NULL DEFAULT '16:9',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);
