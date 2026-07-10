import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/encryption.js";
import { generateToken } from "../utils/jwt.js";
import { Role, LoanStatus } from "../../generated/prisma/index.js";

vi.mock("../lib/prisma.js");
const prismaMock = prisma as any;

describe("Uji Coba Program dengan Contoh Data (Skenario Data)", () => {
  const app = createApp();
  let adminToken = "";

  beforeEach(() => {
    vi.clearAllMocks();
    adminToken = generateToken({ id: 1, role: Role.ADMIN });
    
    // Mock user admin untuk auth middleware
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      role: Role.ADMIN,
    });
  });

  describe("Skenario A: Validasi Data Login", () => {
    it("Harus gagal login jika format email/NIS kosong", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ identifier: "", password: "" });

      expect(res.status).toBe(400);
      expect(res.body.meta.message).toMatch(/validasi/i);
      console.log("[\u2713] Skenario A.1 Berhasil: Sistem menolak login dengan data kosong (Validasi Zod).");
    });

    it("Harus gagal login jika password salah", async () => {
      const hashedPassword = await hashPassword("passwordBenar123");
      prismaMock.user.findFirst.mockResolvedValue({
        id: 1,
        password: hashedPassword,
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ identifier: "user@test.com", password: "passwordSalah123" });

      expect(res.status).toBe(400);
      expect(res.body.meta.message).toMatch(/password|kredensial|invalid/i);
      console.log("[\u2713] Skenario A.2 Berhasil: Sistem menolak login dengan password yang salah.");
    });
  });

  describe("Skenario B: Validasi Tambah Buku (Boundary & Edge Cases)", () => {
    it("Harus gagal tambah buku jika stok negatif", async () => {
      const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          categoryId: 1,
          title: "Buku Test Negatif",
          author: "Penulis",
          stock: -5
        });

      expect(res.status).toBe(400);
      expect(res.body.data.stock[0]).toMatch(/negatif|minimal/i);
      console.log("[\u2713] Skenario B.1 Berhasil: Sistem menolak penambahan buku dengan stok negatif.");
    });

    it("Harus sukses tambah buku jika data sesuai aturan", async () => {
      prismaMock.category.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.book.create.mockResolvedValue({
        id: 1,
        categoryId: 1,
        title: "Buku Contoh Sempurna",
        author: "Penulis Teladan",
        stock: 10,
      });

      const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          categoryId: 1,
          title: "Buku Contoh Sempurna",
          author: "Penulis Teladan",
          stock: 10
        });

      expect(res.status).toBe(201);
      console.log("[\u2713] Skenario B.2 Berhasil: Sistem menerima data buku yang valid.");
    });
  });

  describe("Skenario C: Aturan Pengembalian Buku (Denda & Kondisi)", () => {
    it("Harus gagal mengembalikan buku jika kondisi DAMAGED tapi tanpa adminNote", async () => {
      prismaMock.loan.findUnique.mockResolvedValue({
        id: 1,
        status: LoanStatus.APPROVED,
        bookId: 1,
        dueDate: new Date(Date.now() + 86400000)
      });
      
      const res = await request(app)
        .patch("/api/loans/1/return")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          bookCondition: "DAMAGED",
          adminNote: ""
        });

      expect(res.status).toBe(400);
      expect(res.body.data.adminNote[0]).toMatch(/wajib diisi jika buku rusak atau hilang/i);
      console.log("[\u2713] Skenario C.1 Berhasil: Sistem mewajibkan admin mengisi catatan (adminNote) jika kondisi buku rusak (DAMAGED).");
    });

    it("Harus sukses mengembalikan buku jika kondisi GOOD", async () => {
      prismaMock.loan.findUnique.mockResolvedValue({
        id: 1,
        status: LoanStatus.APPROVED,
        bookId: 1,
        dueDate: new Date(Date.now() + 86400000)
      });
      prismaMock.$transaction.mockResolvedValue([
        { id: 1, status: LoanStatus.RETURNED },
        { id: 1, stock: 11 }
      ]);

      const res = await request(app)
        .patch("/api/loans/1/return")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          bookCondition: "GOOD"
        });

      expect(res.status).toBe(200);
      console.log("[\u2713] Skenario C.2 Berhasil: Pengembalian buku dalam kondisi baik (GOOD) diproses tanpa butuh catatan tambahan.");
    });
  });
});
