-- Drop FK so idolId can be nullable
ALTER TABLE "Inquiry" DROP CONSTRAINT IF EXISTS "Inquiry_idolId_fkey";

-- Allow general enquiries without a linked idol
ALTER TABLE "Inquiry" ALTER COLUMN "idolId" DROP NOT NULL;

-- Source: website form vs WhatsApp quick enquiry
CREATE TYPE "InquirySource" AS ENUM ('website', 'whatsapp');

ALTER TABLE "Inquiry" ADD COLUMN "source" "InquirySource" NOT NULL DEFAULT 'website';

ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_idolId_fkey" FOREIGN KEY ("idolId") REFERENCES "Idol"("id") ON DELETE SET NULL ON UPDATE CASCADE;
