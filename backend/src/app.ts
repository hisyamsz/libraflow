import cors from "cors";
import express from "express";
import router from "./routes/api.js";
import bodyParser from "body-parser";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { localeMiddleware } from "./middlewares/locale.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { prisma } from "./lib/prisma.js";

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
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "LibraFlow API",
        version: "1.0.0",
        description: "API documentation for LibraFlow Library Management System",
      },
      servers: [
        {
          url: "http://localhost:3555/api",
        },
      ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use("/api", router);
  app.use(globalErrorHandler);

  return app;
}
