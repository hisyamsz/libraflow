import { PrismaClient } from "../../../generated/prisma/index.js";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { DeepMockProxy } from "vitest-mock-extended";
import { prisma } from "../../lib/prisma.js";
import { beforeEach, vi } from "vitest";

// Vi mock akan menggantikan semua import ke lib/prisma.js dengan interceptor ini
vi.mock("../../lib/prisma.js", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
