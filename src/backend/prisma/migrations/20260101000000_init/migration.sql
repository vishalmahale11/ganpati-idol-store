-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "IdolCategory" AS ENUM ('Clay', 'Marble', 'EcoFriendly', 'PlasterOfParis', 'Metal', 'Fiber');

-- CreateTable
CREATE TABLE "Idol" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "IdolCategory" NOT NULL,
    "material" TEXT NOT NULL,
    "heightCm" BIGINT NOT NULL,
    "price" BIGINT NOT NULL,
    "images" JSONB NOT NULL,
    "stockQuantity" BIGINT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" BIGSERIAL NOT NULL,
    "idolId" BIGINT NOT NULL,
    "idolName" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "preferredContact" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_idolId_fkey" FOREIGN KEY ("idolId") REFERENCES "Idol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
