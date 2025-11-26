ALTER TABLE "expenses" ALTER COLUMN "createdAt" SET DATA TYPE timestamp WITHOUT TIME ZONE USING NULLIF("createdAt", '')::timestamp WITHOUT TIME ZONE;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "createdAt" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "createdAt" DROP NOT NULL;