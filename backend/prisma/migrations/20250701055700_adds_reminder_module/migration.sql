-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "response" TEXT,
    "sendOnEmail" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reminder_senderId_idx" ON "Reminder"("senderId");

-- CreateIndex
CREATE INDEX "Reminder_receiverId_idx" ON "Reminder"("receiverId");
