import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/index.js";
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from "../utils/env.js";

const port = DATABASE_PORT ? parseInt(DATABASE_PORT) : 3306;

const adapter = new PrismaMariaDb({
  host: DATABASE_HOST,
  port: isNaN(port) ? 3306 : port,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  connectTimeout: 10000, // 10 seconds timeout for handshake
  connectionLimit: 2,    // Optimize for serverless: prevent connection starvation on Aiven
});
const prisma = new PrismaClient({ adapter });

export { prisma };
