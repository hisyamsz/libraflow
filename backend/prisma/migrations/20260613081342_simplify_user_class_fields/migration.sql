/*
  Warnings:

  - You are about to drop the column `major` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_type` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `major`,
    DROP COLUMN `user_type`;
