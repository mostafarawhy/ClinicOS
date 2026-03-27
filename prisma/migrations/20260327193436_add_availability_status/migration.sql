-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'BUSY', 'SICK_LEAVE', 'VACATION', 'REMOTE', 'DAY_OFF');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "availabilityStatus" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE';
