import { PrismaClient } from "../../../generated/prisma/index.js";
import { mockDeep, mockReset } from "vitest-mock-extended";

// Mock instance
export const prisma = mockDeep<PrismaClient>();

// Helper to reset mocks between tests
export const resetPrismaMock = () => {
  mockReset(prisma);
};
