/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Invitation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invitation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Invitation" ("createdAt", "email", "id", "token", "used") SELECT "createdAt", "email", "id", "token", "used" FROM "Invitation";
DROP TABLE "Invitation";
ALTER TABLE "new_Invitation" RENAME TO "Invitation";
CREATE UNIQUE INDEX "Invitation_email_key" ON "Invitation"("email");
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
