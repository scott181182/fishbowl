-- CreateTable
CREATE TABLE "GameRoom" (
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clients" INTEGER NOT NULL,
    "maxClients" INTEGER NOT NULL,
    "publicAddress" TEXT,
    "processId" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL,
    "private" BOOLEAN NOT NULL,
    "unlisted" BOOLEAN NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("roomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameRoom_name_key" ON "GameRoom"("name");
