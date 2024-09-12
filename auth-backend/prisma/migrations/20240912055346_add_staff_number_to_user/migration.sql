/*
  Warnings:

  - A unique constraint covering the columns `[staffNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `staffNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '未設定',
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employmentStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employmentStatus" TEXT NOT NULL DEFAULT '未設定',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '未設定',
ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT '未設定',
ADD COLUMN "staffNumber" VARCHAR(255);
-- 既存のユーザーに仮のスタッフ番号を追加する（例として "TEMP-1234", "TEMP-1235", "TEMP-1236" などを使用）
UPDATE "User" SET "staffNumber" = 'TEMP-1234' || "id" WHERE "staffNumber" IS NULL;

-- ここで、"staffNumber" カラムを `NOT NULL` に設定する
ALTER TABLE "User" ALTER COLUMN "staffNumber" SET NOT NULL;
-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NGStaff" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "NGStaff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_userId_key" ON "EmergencyContact"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_staffNumber_key" ON "User"("staffNumber");

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NGStaff" ADD CONSTRAINT "NGStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

