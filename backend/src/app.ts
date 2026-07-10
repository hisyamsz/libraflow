import cors from "cors";
import express from "express";
import router from "./routes/api.js";
import bodyParser from "body-parser";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { localeMiddleware } from "./middlewares/locale.middleware.js";
import swaggerUi from "swagger-ui-express";
import { prisma } from "./lib/prisma.js";
import fs from "fs";
import path from "path";

/**
 * Factory yang menginisialisasi Express app beserta semua middleware.
 * Dipisahkan dari index.ts agar dapat di-import oleh integration test
 * tanpa menjalankan server atau koneksi database secara nyata.
 */
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(localeMiddleware);

  app.get("/", (_req, res) => {
    res.status(200).json({ data: null, message: "Server is running" });
  });

  app.get("/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({
        status: "ok",
        database: "connected",
        uptime: process.uptime(),
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        database: "disconnected",
        uptime: process.uptime(),
      });
    }
  });

  // Swagger setup
  try {
    // Gunakan fs untuk membaca file JSON karena import type assertion dapat berbeda di tiap versi Node
    const srcPath = path.resolve(process.cwd(), "src/docs/swagger_output.json");
    const distPath = path.resolve(process.cwd(), "dist/docs/swagger_output.json");
    const swaggerPath = fs.existsSync(distPath) ? distPath : srcPath;
    
    if (fs.existsSync(swaggerPath)) {
      const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
      app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } else {
      console.warn("Swagger docs tidak ditemukan di src/docs/swagger_output.json atau dist/docs/swagger_output.json");
    }
  } catch (error) {
    console.error("Gagal memuat Swagger docs", error);
  }

  app.use("/api", router);
  app.use(globalErrorHandler);

  return app;
}
