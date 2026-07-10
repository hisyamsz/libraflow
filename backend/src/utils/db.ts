import { prisma } from "../lib/prisma.js";

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connection successful!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}
