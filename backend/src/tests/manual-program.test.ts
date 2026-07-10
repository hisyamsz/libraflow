import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/encryption.js";
import { Role, LoanStatus } from "../../generated/prisma/index.js";

// Mock prisma
vi.mock("../lib/prisma.js");
const prismaMock = prisma as any;

describe("Simulasi Penggunaan Program Manual (Manual Program)", () => {
  const app = createApp();
  let adminToken = "";
  let memberToken = "";
  let memberId = 2;
  let categoryId = 1;
  let bookId = 1;
  let loanId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Langkah 1: Admin melakukan Login", async () => {
    const hashedPassword = await hashPassword("admin123");
    prismaMock.user.findFirst.mockResolvedValue({
      id: 1,
      name: "Administrator",
      email: "admin@admin.com",
      nis: "1000000",
      password: hashedPassword,
      role: Role.ADMIN,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "admin@admin.com", password: "admin123" });

    expect(res.status).toBe(200);
    adminToken = res.body.data;
    console.log("[\u2713] Langkah 1 Berhasil: Admin berhasil login dan mendapatkan token.");
  });

  it("Langkah 2: Admin membuat Kategori Buku baru", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null);
    prismaMock.category.create.mockResolvedValue({
      id: categoryId,
      name: "Sains dan Teknologi",
      description: "Buku-buku seputar sains",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Sains dan Teknologi", description: "Buku-buku seputar sains" });

    expect(res.status).toBe(201);
    console.log("[\u2713] Langkah 2 Berhasil: Kategori 'Sains dan Teknologi' berhasil ditambahkan.");
  });

  it("Langkah 3: Admin menambahkan Buku baru", async () => {
    prismaMock.category.findUnique.mockResolvedValue({ id: categoryId });
    prismaMock.book.findUnique.mockResolvedValue(null); // ISBN blm ada
    prismaMock.book.create.mockResolvedValue({
      id: bookId,
      categoryId,
      title: "Belajar TypeScript Modern",
      author: "John Doe",
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoryId,
        title: "Belajar TypeScript Modern",
        author: "John Doe",
        stock: 5
      });

    expect(res.status).toBe(201);
    console.log("[\u2713] Langkah 3 Berhasil: Buku 'Belajar TypeScript Modern' berhasil ditambahkan.");
  });

  it("Langkah 4: Admin mendaftarkan Anggota (Member) baru", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null); // NIS blm ada
    prismaMock.user.create.mockResolvedValue({
      id: memberId,
      name: "Budi Santoso",
      nis: "20260001",
      role: Role.MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Budi Santoso",
        nis: "20260001",
        password: "password123",
        role: "MEMBER"
      });

    expect(res.status).toBe(201);
    console.log("[\u2713] Langkah 4 Berhasil: Anggota baru 'Budi Santoso' berhasil didaftarkan.");
  });

  it("Langkah 5: Anggota melakukan Login", async () => {
    const hashedPassword = await hashPassword("password123");
    prismaMock.user.findFirst.mockResolvedValue({
      id: memberId,
      name: "Budi Santoso",
      nis: "20260001",
      password: hashedPassword,
      role: Role.MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "20260001", password: "password123" });

    expect(res.status).toBe(200);
    memberToken = res.body.data;
    console.log("[\u2713] Langkah 5 Berhasil: Anggota (Budi Santoso) berhasil login.");
  });

  it("Langkah 6: Anggota mengajukan Peminjaman Buku", async () => {
    prismaMock.book.findUnique.mockResolvedValue({ id: bookId, stock: 5 });
    prismaMock.loan.count.mockResolvedValue(0); // Belum pinjam buku yg sama
    prismaMock.loan.create.mockResolvedValue({
      id: loanId,
      userId: memberId,
      bookId,
      status: LoanStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ bookId });

    expect(res.status).toBe(201);
    console.log("[\u2713] Langkah 6 Berhasil: Anggota berhasil mengajukan peminjaman buku.");
  });

  it("Langkah 7: Admin melihat daftar Peminjaman", async () => {
    prismaMock.loan.findMany.mockResolvedValue([
      { id: loanId, status: LoanStatus.PENDING, user: { name: "Budi Santoso" }, book: { title: "Belajar TypeScript Modern" } }
    ]);
    prismaMock.loan.count.mockResolvedValue(1);

    const res = await request(app)
      .get("/api/loans")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    console.log("[\u2713] Langkah 7 Berhasil: Admin berhasil melihat daftar peminjaman masuk.");
  });

  it("Langkah 8: Admin menyetujui Peminjaman", async () => {
    prismaMock.loan.findUnique.mockResolvedValue({
      id: loanId,
      status: LoanStatus.PENDING,
      bookId,
      book: { stock: 5 }
    });
    
    // Transaksi prisma (update loan + update book stock)
    prismaMock.$transaction.mockResolvedValue([
      { id: loanId, status: LoanStatus.APPROVED },
      { id: bookId, stock: 4 }
    ]);

    const res = await request(app)
      .patch(`/api/loans/${loanId}/approve`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    console.log("[\u2713] Langkah 8 Berhasil: Admin menyetujui peminjaman. Stok buku dikurangi 1.");
  });

  it("Langkah 9: Admin memproses Pengembalian Buku", async () => {
    prismaMock.loan.findUnique.mockResolvedValue({
      id: loanId,
      status: LoanStatus.APPROVED,
      bookId,
      dueDate: new Date(Date.now() + 86400000) // belum telat
    });

    prismaMock.$transaction.mockResolvedValue([
      { id: loanId, status: LoanStatus.RETURNED },
      { id: bookId, stock: 5 }
    ]);

    const res = await request(app)
      .patch(`/api/loans/${loanId}/return`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ bookCondition: "GOOD" });

    expect(res.status).toBe(200);
    console.log("[\u2713] Langkah 9 Berhasil: Buku dikembalikan dengan kondisi BAIK. Stok buku bertambah 1.");
  });

  it("Langkah 10: Admin mengecek Statistik Dashboard", async () => {
    prismaMock.book.count.mockResolvedValue(1);
    prismaMock.user.count.mockResolvedValue(1); // excluding admin normally but it's mocked
    prismaMock.loan.count.mockResolvedValue(1); // returned
    
    // For pending loans etc. we just mock the return of the count
    prismaMock.loan.count.mockResolvedValue(0); 

    const res = await request(app)
      .get("/api/dashboard/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    console.log("[\u2713] Langkah 10 Berhasil: Admin berhasil mengecek statistik perpustakaan terkini.");
  });
});
