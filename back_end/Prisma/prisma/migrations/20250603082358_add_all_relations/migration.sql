/*
  Warnings:

  - A unique constraint covering the columns `[bookId]` on the table `Stat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookId` to the `Stat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "superAdminId" INTEGER;

-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "createdByAdminId" INTEGER;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "createdByAdminId" INTEGER;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "createdByAdminId" INTEGER;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "createdByAdminId" INTEGER;

-- AlterTable
ALTER TABLE "Stat" ADD COLUMN     "bookId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdByAdminId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Stat_bookId_key" ON "Stat"("bookId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
