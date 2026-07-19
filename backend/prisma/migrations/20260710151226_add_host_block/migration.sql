-- CreateTable
CREATE TABLE "HostBlock" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "blockedUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HostBlock_hostId_blockedUserId_key" ON "HostBlock"("hostId", "blockedUserId");

-- AddForeignKey
ALTER TABLE "HostBlock" ADD CONSTRAINT "HostBlock_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostBlock" ADD CONSTRAINT "HostBlock_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
