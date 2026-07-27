-- CreateTable
CREATE TABLE "OrderPaymentEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DECIMAL(10,2),
    "method" TEXT,
    "provider" TEXT,
    "reference" TEXT,
    "installments" INTEGER,
    "notes" TEXT,
    "reason" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT,
    "adminEmail" TEXT,
    "adminRole" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderPaymentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderPaymentEvent_orderId_idx" ON "OrderPaymentEvent"("orderId");

-- CreateIndex
CREATE INDEX "OrderPaymentEvent_eventType_idx" ON "OrderPaymentEvent"("eventType");

-- CreateIndex
CREATE INDEX "OrderPaymentEvent_status_idx" ON "OrderPaymentEvent"("status");

-- CreateIndex
CREATE INDEX "OrderPaymentEvent_createdAt_idx" ON "OrderPaymentEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "OrderPaymentEvent" ADD CONSTRAINT "OrderPaymentEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
