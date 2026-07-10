import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/encryption.js";
import { generateToken } from "../utils/jwt.js";
import { Role } from "../../generated/prisma/index.js";

// Mock Prisma client
vi.mock("../lib/prisma.js");
const prismaMock = prisma as any;

describe("Laporan Pengujian White Box — Autentikasi Admin dan Data Master", () => {
  const app = createApp();
  let adminToken = "";

  beforeEach(() => {
    vi.clearAllMocks();
    adminToken = generateToken({ id: 1, role: Role.ADMIN });

    // Mock admin user lookup for auth middleware
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      role: Role.ADMIN,
    });
  });

  // ============================================================================
  // A. MODUL: LOGIN ADMIN
  // ============================================================================
  describe("A. Modul: Login Admin", () => {
    it("TC-AUTH-01: Autentikasi admin", async () => {
      const hashedPassword = await hashPassword("Admin90");
      prismaMock.user.findFirst.mockResolvedValue({
        id: 1,
        name: "Admin Utama",
        nis: "12345",
        password: hashedPassword,
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ identifier: "12345", password: "Admin90" });

      expect(res.status).toBe(200);
      expect(res.body.meta.message).toMatch(/success|berhasil/i);
      expect(res.body.data).toBeDefined(); // Token JWT
    });
  });

  // ============================================================================
  // B. MODUL: MANAJEMEN KATEGORI BUKU
  // ============================================================================
  describe("B. Modul: Manajemen Kategori Buku", () => {
    it("TC-CAT-01: Tambah kategori valid", async () => {
      prismaMock.category.create.mockResolvedValue({
        id: 1,
        name: "Sains dan Teknologi",
        description: "Buku bertema sains",
      });

      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Sains dan Teknologi", description: "Buku bertema sains" });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Sains dan Teknologi");
    });

    it("TC-CAT-02: Tambah kategori invalid (nama kosong)", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "", description: "Nama kosong" });

      expect(res.status).toBe(400);
    });

    it("TC-CAT-03: Cari kategori", async () => {
      prismaMock.category.findMany.mockResolvedValue([
        { id: 1, name: "Sains dan Teknologi", description: "Buku bertema sains" },
      ]);
      prismaMock.category.count.mockResolvedValue(1);

      const res = await request(app)
        .get("/api/categories")
        .query({ search: "Sains" });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("TC-CAT-04: Ubah kategori", async () => {
      prismaMock.category.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.category.update.mockResolvedValue({
        id: 1,
        name: "Sains Modern",
        description: "Buku sains terupdate",
      });

      const res = await request(app)
        .put("/api/categories/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Sains Modern", description: "Buku sains terupdate" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Sains Modern");
    });

    it("TC-CAT-05: Hapus kategori", async () => {
      prismaMock.category.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.category.delete.mockResolvedValue({ id: 1 });

      const res = await request(app)
        .delete("/api/categories/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });

  // ============================================================================
  // C. MODUL: MANAJEMEN BUKU
  // ============================================================================
  describe("C. Modul: Manajemen Buku", () => {
    it("TC-BOOK-01: Tambah buku valid", async () => {
      prismaMock.category.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.book.create.mockResolvedValue({
        id: 1,
        categoryId: 1,
        title: "Panduan Belajar TypeScript",
        author: "John Doe",
        stock: 5,
      });

      const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          categoryId: 1,
          title: "Panduan Belajar TypeScript",
          author: "John Doe",
          stock: 5,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("Panduan Belajar TypeScript");
    });

    it("TC-BOOK-02: Tambah buku invalid (judul/penulis kosong)", async () => {
      const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          categoryId: 1,
          title: "",
          author: "",
          stock: 5,
        });

      expect(res.status).toBe(400);
    });

    it("TC-BOOK-03: Cari buku", async () => {
      prismaMock.book.findMany.mockResolvedValue([
        { id: 1, title: "Panduan Belajar TypeScript", author: "John Doe", stock: 5 },
      ]);
      prismaMock.book.count.mockResolvedValue(1);

      const res = await request(app)
        .get("/api/books")
        .query({ search: "TypeScript" });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("TC-BOOK-04: Ubah buku", async () => {
      prismaMock.book.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.book.update.mockResolvedValue({
        id: 1,
        title: "TypeScript Advance",
        author: "John Doe",
        stock: 10,
      });

      const res = await request(app)
        .put("/api/books/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          categoryId: 1,
          title: "TypeScript Advance",
          author: "John Doe",
          stock: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("TypeScript Advance");
    });

    it("TC-BOOK-05: Hapus buku", async () => {
      prismaMock.book.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.book.delete.mockResolvedValue({ id: 1 });

      const res = await request(app)
        .delete("/api/books/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });

  // ============================================================================
  // D. MODUL: MANAJEMEN USER
  // ============================================================================
  describe("D. Modul: Manajemen User", () => {
    it("TC-USER-01: Tambah user valid", async () => {
      prismaMock.user.create.mockResolvedValue({
        id: 2,
        name: "Budi Santoso",
        nis: "20260001",
        role: Role.MEMBER,
      });

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Budi Santoso",
          nis: "20260001",
          password: "password123",
          role: "MEMBER",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Budi Santoso");
    });

    it("TC-USER-02: Tambah user invalid (nama/NIS kosong)", async () => {
      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "",
          nis: "",
          password: "password123",
          role: "MEMBER",
        });

      expect(res.status).toBe(400);
    });

    it("TC-USER-03: Cari user", async () => {
      prismaMock.user.findMany.mockResolvedValue([
        { id: 2, name: "Budi Santoso", nis: "20260001", role: Role.MEMBER },
      ]);
      prismaMock.user.count.mockResolvedValue(1);

      const res = await request(app)
        .get("/api/users")
        .query({ search: "Budi" })
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("TC-USER-04: Ubah user", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 2 });
      prismaMock.user.update.mockResolvedValue({
        id: 2,
        name: "Budi Santoso Purwanto",
        nis: "20260001",
        role: Role.MEMBER,
      });

      const res = await request(app)
        .put("/api/users/2")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Budi Santoso Purwanto",
          role: "MEMBER",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Budi Santoso Purwanto");
    });

    it("TC-USER-05: Hapus user", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 2 });
      prismaMock.user.delete.mockResolvedValue({ id: 2 });

      const res = await request(app)
        .delete("/api/users/2")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });
});
