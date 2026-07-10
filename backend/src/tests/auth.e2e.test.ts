import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/encryption.js";
import { generateToken } from "../utils/jwt.js";
import { Role } from "../../generated/prisma/index.js";

// Menggunakan vi.mock untuk module prisma agar menggunakan versi di __mocks__
vi.mock("../lib/prisma.js");

// Cast prisma menjadi mock object untuk setup return value
const prismaMock = prisma as any;

describe("Auth Module E2E (Mocked Prisma)", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("harus mengembalikan 400 Validation Error dalam Bahasa Indonesia (default fallback) jika body kosong", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.meta.message).toMatch(/validasi data gagal/i);
    });

    it("harus mengembalikan 400 Validation Error dalam Bahasa Inggris jika Accept-Language: en", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .set("Accept-Language", "en")
        .send({ identifier: "" }); // Kosong memicu validasi required/min

      expect(res.status).toBe(400);
      // Validasi dari i18n
      expect(res.body.meta.message).toMatch(/data validation failed/i);
      expect(res.body.data.identifier[0]).toMatch(/Email atau NIS wajib diisi/i);
    });

    it("harus mengembalikan 404 jika user tidak ditemukan", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ identifier: "123456", password: "password123" });

      expect(res.status).toBe(404);
      expect(res.body.meta.message).toMatch(/pengguna tidak ditemukan/i);
    });

    it("harus mengembalikan 200 dan JWT token jika login sukses", async () => {
      const hashedPassword = await hashPassword("password123");
      prismaMock.user.findFirst.mockResolvedValue({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        nis: "123456",
        password: hashedPassword,
        role: Role.MEMBER,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ identifier: "123456", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.meta.message).toMatch(/login berhasil/i);
      expect(typeof res.body.data).toBe("string");
    });
  });

  describe("GET /api/auth/me", () => {
    it("harus mengembalikan 401 jika tidak ada token", async () => {
      const res = await request(app).get("/api/auth/me");
      
      expect(res.status).toBe(401);
      expect(res.body.meta.message).toMatch(/akses tidak sah/i);
    });

    it("harus mengembalikan 401 dalam bahasa Inggris jika header Accept-Language: en", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Accept-Language", "en");
        
      expect(res.status).toBe(401);
      expect(res.body.meta.message).toMatch(/unauthorized/i);
    });

    it("harus mengembalikan profil pengguna jika token valid", async () => {
      const token = generateToken({ id: 1, role: Role.MEMBER });
      
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        nis: "123456",
        role: Role.MEMBER,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.meta.message).toMatch(/berhasil mengambil/i);
      expect(res.body.data.name).toBe("Test User");
    });
  });
});
