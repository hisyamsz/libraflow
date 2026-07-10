import type { Response, NextFunction } from "express";
import PDFDocument from "pdfkit";
import response from "../utils/response.js";
import { MAX_LOANS_LIMIT } from "../utils/constants.js";
import {
  createLoanSchema,
  rejectLoanSchema,
  returnLoanSchema,
} from "../validations/loan.validation.js";
import type { IReqUser } from "../utils/interface.js";
import { prisma } from "../lib/prisma.js";
import { LoanStatus, BookCondition } from "../../generated/prisma/index.js";
import { userSelect } from "../utils/user.js";
import { getPaginationParams } from "../utils/pagination.js";

export default {
  /**
   * POST /api/loans
   * Mengajukan peminjaman buku (MEMBER only)
   */
  async create(req: IReqUser, res: Response, next: NextFunction) {
    try {
      // Keamanan lapis 2: Cegah ADMIN atau role selain MEMBER melakukan transaksi peminjaman
      if (req.user!.role !== "MEMBER") {
        return response.unauthorized(res, "loan.memberOnly");
      }

      const userId = req.user!.id;
      const today = new Date();

      const overdueLoan = await prisma.loan.findFirst({
        where: {
          userId,
          status: LoanStatus.APPROVED,
          dueDate: { lt: today },
        },
      });

      if (overdueLoan) {
        return response.unauthorized(res, "loan.overdueBlock");
      }

      const activeLoansCount = await prisma.loan.count({
        where: {
          userId,
          status: { in: [LoanStatus.PENDING, LoanStatus.APPROVED] },
        },
      });

      if (activeLoansCount >= MAX_LOANS_LIMIT) {
        return response.badRequest(res, "loan.limitReached", null, {
          limit: MAX_LOANS_LIMIT,
        });
      }

      const result = createLoanSchema.safeParse(req.body);

      if (!result.success) {
        return next(result.error);
      }

      const { bookId } = result.data;

      // Validasi 1: Cegah duplikat (status PENDING atau APPROVED)
      const existingLoan = await prisma.loan.findFirst({
        where: {
          userId,
          bookId,
          status: { in: [LoanStatus.PENDING, LoanStatus.APPROVED] },
        },
      });

      if (existingLoan) {
        return response.badRequest(res, "loan.duplicateLoan");
      }

      // Validasi 2: Cek ketersediaan stok
      const book = await prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        return response.notFound(res, "book.notFound");
      }

      if (book.stock <= 0) {
        return response.badRequest(res, "loan.stockEmpty");
      }

      // Buat record peminjaman baru (status default: PENDING)
      const loan = await prisma.loan.create({
        data: { userId, bookId },
        include: {
          book: true,
          user: { select: userSelect },
        },
      });

      return response.created(res, loan, "loan.createSuccess");
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/loans
   * Khusus ADMIN: Mengambil seluruh riwayat peminjaman dari semua user di sistem.
   * Dilengkapi dengan pagination, filter status, dan search judul buku / nama peminjam.
   */
  async findAll(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const { status, search, startDate, endDate, all } = req.query as {
        status?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
        all?: string;
      };

      const where: any = {};

      if (status) {
        if (Object.values(LoanStatus).includes(status as any)) {
          where.status = status;
        } else {
          return response.badRequest(res, "loan.invalidStatus");
        }
      }

      if (search) {
        // Admin bisa mencari berdasarkan judul buku ATAU nama user peminjam
        // Catatan: MySQL sudah case-insensitive secara default, mode: "insensitive" tidak diperlukan
        where.OR = [
          {
            book: {
              title: { contains: search },
            },
          },
          {
            user: {
              name: { contains: search },
            },
          },
        ];
      }

      if (startDate || endDate) {
        where.loanDate = {};
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          where.loanDate.gte = start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          where.loanDate.lte = end;
        }
      }

      const isAll = all === "true";

      if (isAll) {
        const loans = await prisma.loan.findMany({
          where,
          include: {
            book: true,
            user: { select: userSelect },
          },
          orderBy: { createdAt: "desc" },
        });

        return response.success(res, loans, "loan.findAllSuccess");
      } else {
        const { page, limit, skip } = getPaginationParams(req);

        const [loans, count] = await Promise.all([
          prisma.loan.findMany({
            where,
            skip,
            take: limit,
            include: {
              book: true,
              user: { select: userSelect },
            },
            orderBy: { createdAt: "desc" },
          }),
          prisma.loan.count({ where }),
        ]);

        return response.pagination(
          res,
          loans,
          {
            current: page,
            total: count,
            totalPage: Math.ceil(count / limit),
          },
          "loan.findAllSuccess",
        );
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/loans/my
   * Mengambil riwayat peminjaman milik user yang sedang login (MEMBER maupun ADMIN).
   * Data selalu difilter berdasarkan userId dari token JWT untuk mencegah IDOR.
   */
  async findMyLoans(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const { status, search } = req.query as {
        status?: string;
        search?: string;
      };
      const { page, limit, skip } = getPaginationParams(req);

      // Paksa filter userId — mencegah IDOR, tidak peduli role
      const where: any = {
        userId: userId,
      };

      if (status) {
        if (Object.values(LoanStatus).includes(status as any)) {
          where.status = status;
        } else {
          return response.badRequest(res, "loan.invalidStatus");
        }
      }

      if (search) {
        // Pencarian hanya berdasarkan judul buku dalam daftar miliknya sendiri
        // Catatan: MySQL sudah case-insensitive secara default, mode: "insensitive" tidak diperlukan
        where.book = {
          title: { contains: search },
        };
      }

      const [loans, count] = await Promise.all([
        prisma.loan.findMany({
          where,
          skip,
          take: limit,
          include: {
            book: true,
            user: { select: userSelect },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.loan.count({ where }),
      ]);

      return response.pagination(
        res,
        loans,
        {
          current: page,
          total: count,
          totalPage: Math.ceil(count / limit),
        },
        "loan.findMyLoansSuccess",
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/loans/:id/approve
   * Approve peminjaman (ADMIN only) + kurangi stok buku via transaction
   */
  async approve(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return response.notFound(res, "loan.invalidId");
      }

      // Validasi: cek loan ada dan statusnya PENDING
      const loan = await prisma.loan.findUnique({ where: { id } });

      if (!loan) {
        return response.notFound(res, "loan.notFound");
      }

      if (loan.status !== LoanStatus.PENDING) {
        return response.badRequest(res, "loan.alreadyProcessedApprove");
      }

      // Proteksi stok buku: Pastikan stok tidak habis sebelum menyetujui peminjaman
      const book = await prisma.book.findUnique({
        where: { id: loan.bookId },
      });

      if (!book) {
        return response.notFound(res, "book.notFound");
      }

      if (book.stock <= 0) {
        return response.badRequest(res, "loan.approveStockEmpty");
      }

      const now = new Date();
      const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 hari

      // Transaksi: update Loan + decrement stok Buku secara atomik
      const [updatedLoan] = await prisma.$transaction([
        prisma.loan.update({
          where: { id },
          data: {
            status: LoanStatus.APPROVED,
            loanDate: now,
            dueDate,
          },
          include: {
            book: true,
            user: { select: userSelect },
          },
        }),
        prisma.book.update({
          where: { id: loan.bookId },
          data: { stock: { decrement: 1 } },
        }),
      ]);

      return response.success(res, updatedLoan, "loan.approveSuccess");
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/loans/:id/reject
   * Tolak peminjaman (ADMIN only), opsional sertakan adminNote
   */
  async reject(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return response.notFound(res, "loan.invalidId");
      }

      // Validasi: cek loan ada dan statusnya PENDING
      const loan = await prisma.loan.findUnique({ where: { id } });

      if (!loan) {
        return response.notFound(res, "loan.notFound");
      }

      if (loan.status !== LoanStatus.PENDING) {
        return response.badRequest(res, "loan.alreadyProcessedReject");
      }

      // Ambil adminNote dari body (opsional)
      const result = rejectLoanSchema.safeParse(req.body);

      if (!result.success) {
        return next(result.error);
      }

      const { adminNote } = result.data;

      const updatedLoan = await prisma.loan.update({
        where: { id },
        data: {
          status: LoanStatus.REJECTED,
          adminNote: adminNote ?? null,
        },
        include: {
          book: true,
          user: { select: userSelect },
        },
      });

      return response.success(res, updatedLoan, "loan.rejectSuccess");
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/loans/:id/return
   * Proses pengembalian buku (ADMIN only) + penyesuaian stok kondisional via transaction
   */
  async returnLoan(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return response.notFound(res, "loan.invalidId");
      }

      // Validasi: cek loan ada
      const loan = await prisma.loan.findUnique({ where: { id } });

      if (!loan) {
        return response.notFound(res, "loan.notFound");
      }

      // Validasi: status harus APPROVED
      if (loan.status !== LoanStatus.APPROVED) {
        return response.badRequest(res, "loan.mustBeApproved");
      }

      const result = returnLoanSchema.safeParse(req.body);

      if (!result.success) {
        return next(result.error);
      }

      const { bookCondition, adminNote } = result.data;

      const now = new Date();

      // Transaksi Database: Update status peminjaman dan update stok buku secara kondisional
      const updatedLoan = await prisma.$transaction(async (tx) => {
        // 1. Update status peminjaman
        const updated = await tx.loan.update({
          where: { id },
          data: {
            status: LoanStatus.RETURNED,
            returnDate: now,
            bookCondition,
            adminNote: adminNote ?? null,
          },
          include: {
            book: true,
            user: { select: userSelect },
          },
        });

        // 2. Update stok buku (kondisional)
        // Jika buku dikembalikan dalam kondisi BAIK, kembalikan stok.
        // Jika DAMAGED atau LOST, stok tidak di-increment (buku tidak bisa dipinjam lagi).
        if (bookCondition === BookCondition.GOOD) {
          await tx.book.update({
            where: { id: loan.bookId },
            data: { stock: { increment: 1 } },
          });
        }

        return updated;
      });

      return response.success(res, updatedLoan, "loan.returnSuccess");
    } catch (error) {
      next(error);
    }
  },

  async exportPdf(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const { status, search, startDate, endDate } = req.query as {
        status?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
      };

      const where: any = {};

      if (status) {
        if (Object.values(LoanStatus).includes(status as any)) {
          where.status = status;
        } else {
          return response.badRequest(res, "loan.invalidStatus");
        }
      }

      if (search) {
        where.OR = [
          {
            book: {
              title: { contains: search },
            },
          },
          {
            user: {
              name: { contains: search },
            },
          },
        ];
      }

      if (startDate || endDate) {
        where.loanDate = {};
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          where.loanDate.gte = start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          where.loanDate.lte = end;
        }
      }

      const loans = await prisma.loan.findMany({
        where,
        include: {
          book: true,
          user: { select: userSelect },
        },
        orderBy: { createdAt: "desc" },
      });

      const doc = new PDFDocument({
        size: "A4",
        margin: 56.7, // 2cm in points
        bufferPages: true,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="laporan-peminjaman.pdf"',
      );
      doc.pipe(res);

      // Header (Kop Surat)
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("LAPORAN RIWAYAT PEMINJAMAN PERPUSTAKAAN", { align: "center" });
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("LIBRAFLOW DIGITAL LIBRARY", { align: "center" });
      doc.moveDown(0.2);
      doc
        .fontSize(8)
        .font("Helvetica")
        .text(
          "Jl. Ki Hajar Dewantara No.23, Ciputat, Kec. Ciputat, Kota Tangerang Selatan, Banten 15411",
          { align: "center" },
        );
      doc
        .fontSize(8)
        .text("Telp: (021) 1234567 | Surel: info@libraflow.dev", {
          align: "center",
        });
      doc.moveDown(0.5);

      const leftMargin = 56.7;
      const rightMargin = 56.7;
      const width = 595.28 - (leftMargin + rightMargin); // ~481.88
      let y = doc.y;
      doc
        .moveTo(leftMargin, y)
        .lineTo(leftMargin + width, y)
        .lineWidth(2)
        .stroke();
      doc
        .moveTo(leftMargin, y + 3)
        .lineTo(leftMargin + width, y + 3)
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(1.5);

      const formatDate = (dateStr: string | Date) => {
        const d = new Date(dateStr);
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agt",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      };

      y = doc.y;
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("Rentang Tanggal Laporan: ", leftMargin, y, { continued: true });
      doc
        .font("Helvetica")
        .text(
          `${startDate ? formatDate(startDate) : "Awal Transaksi"} s/d ${endDate ? formatDate(endDate) : formatDate(new Date())}`,
        );

      doc
        .font("Helvetica-Bold")
        .text("Tanggal Dicetak: ", 350, y, { continued: true });
      doc.font("Helvetica").text(formatDate(new Date()));
      doc.moveDown(1.5);

      // Summary Stats
      const total = loans.length;
      const active = loans.filter((l) => l.status === "APPROVED").length;
      const overdue = loans.filter((l) => {
        if (l.status !== "APPROVED" || !l.dueDate) return false;
        return new Date(l.dueDate) < new Date();
      }).length;
      const damaged = loans.filter(
        (l) => l.status === "RETURNED" && l.bookCondition === "DAMAGED",
      ).length;
      const lost = loans.filter(
        (l) => l.status === "RETURNED" && l.bookCondition === "LOST",
      ).length;

      y = doc.y;
      const boxHeight = 40;
      doc.rect(leftMargin, y, width, boxHeight).stroke();

      const colWidth = width / 5;
      for (let i = 1; i < 5; i++) {
        doc
          .moveTo(leftMargin + i * colWidth, y)
          .lineTo(leftMargin + i * colWidth, y + boxHeight)
          .stroke();
      }

      const statItems = [
        { label: "TOTAL TRANSAKSI", val: total },
        { label: "BUKU DIPINJAM", val: active },
        { label: "BUKU TERLAMBAT", val: overdue },
        { label: "BUKU RUSAK", val: damaged },
        { label: "BUKU HILANG", val: lost },
      ];

      statItems.forEach((item, idx) => {
        const x = leftMargin + idx * colWidth;
        doc
          .fontSize(7)
          .font("Helvetica-Bold")
          .text(item.label, x, y + 8, { width: colWidth, align: "center" });
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(String(item.val), x, y + 20, {
            width: colWidth,
            align: "center",
          });
      });

      doc.y = y + boxHeight;
      doc.moveDown(1.5);

      // Dynamic Columns Definition (Total width: width)
      const cols = [
        { name: "No", w: 20, align: "center" },
        { name: "Nama Peminjam (NIS)", w: 90, align: "left" },
        { name: "Judul Buku", w: 120, align: "left" },
        { name: "Tgl Pinjam", w: 50, align: "center" },
        { name: "Tenggat", w: 50, align: "center" },
        { name: "Tgl Kembali", w: 50, align: "center" },
        { name: "Status", w: 50, align: "center" },
        { name: "Kondisi", w: width - (20 + 90 + 120 + 50 * 4), align: "center" },
      ];

      let currentX = leftMargin;
      const headers = cols.map((c) => {
        const x = currentX;
        currentX += c.w;
        return { name: c.name, x, w: c.w, align: c.align };
      });

      // Table Header
      y = doc.y;
      doc.rect(leftMargin, y, width, 20).fill("#1e3a8a");
      doc.fillColor("#ffffff");
      doc.strokeColor("black");

      doc.fontSize(8).font("Helvetica-Bold");
      headers.forEach((h) => {
        doc.text(h.name, h.x, y + 6, { width: h.w, align: h.align as any });
        doc.moveTo(h.x, y).lineTo(h.x, y + 20).lineWidth(0.5).stroke();
      });
      doc.moveTo(leftMargin + width, y).lineTo(leftMargin + width, y + 20).stroke();
      doc.rect(leftMargin, y, width, 20).stroke();

      // Reset colors and styles for the rest of the table
      doc.fillColor("black").strokeColor("black").lineWidth(0.5);
      doc.y = y + 20;

      // Table Rows
      doc.font("Helvetica").fontSize(7);

      if (loans.length === 0) {
        y = doc.y;
        doc.rect(leftMargin, y, width, 30).stroke();
        doc.text(
          "Tidak ada data peminjaman dalam rentang tanggal yang dipilih.",
          leftMargin,
          y + 10,
          { width: width, align: "center" },
        );
        doc.y = y + 30;
      } else {
        loans.forEach((loan, index) => {
          const h0 = headers[0]!;
          const h1 = headers[1]!;
          const h2 = headers[2]!;
          const h3 = headers[3]!;
          const h4 = headers[4]!;
          const h5 = headers[5]!;
          const h6 = headers[6]!;
          const h7 = headers[7]!;

          if (doc.y > 700) {
            doc.addPage();
            y = doc.y;
            doc.rect(leftMargin, y, width, 20).fill("#1e3a8a");
            doc.fillColor("#ffffff");
            doc.strokeColor("black");

            doc.fontSize(8).font("Helvetica-Bold");
            headers.forEach((h) => {
              doc.text(h.name, h.x, y + 6, {
                width: h.w,
                align: h.align as any,
              });
              doc.moveTo(h.x, y).lineTo(h.x, y + 20).lineWidth(0.5).stroke();
            });
            doc.moveTo(leftMargin + width, y).lineTo(leftMargin + width, y + 20).stroke();
            doc.rect(leftMargin, y, width, 20).stroke();

            // Reset colors and styles for the rest of the table
            doc.fillColor("black").strokeColor("black").lineWidth(0.5);
            doc.y = y + 20;
            doc.font("Helvetica").fontSize(7);
          }

          y = doc.y;

          const isOverdue = !!(
            loan.status === "APPROVED" &&
            loan.dueDate &&
            new Date(loan.dueDate) < new Date()
          );
          let statusText = "MENUNGGU";
          if (loan.status === "APPROVED") {
            statusText = isOverdue ? "TERLAMBAT" : "DIPINJAM";
          } else if (loan.status === "REJECTED") {
            statusText = "DITOLAK";
          } else if (loan.status === "RETURNED") {
            statusText = "KEMBALI";
          }

          let conditionText = "-";
          if (loan.bookCondition === "GOOD") conditionText = "BAIK";
          else if (loan.bookCondition === "DAMAGED") conditionText = "RUSAK";
          else if (loan.bookCondition === "LOST") conditionText = "HILANG";

          const classText = loan.user.class ? `\nKelas: ${loan.user.class}` : "";
          const nameText = `${loan.user.name}\nNIS: ${loan.user.nis || "-"}${classText}`;
          const titleText = loan.book.title;

          const nameHeight = doc.heightOfString(nameText, { width: h1.w });
          const titleHeight = doc.heightOfString(titleText, { width: h2.w });
          const rowHeight = Math.max(nameHeight, titleHeight, 20) + 8;

          if (index % 2 === 1) {
            doc.rect(leftMargin, y, width, rowHeight).fill("#f9fafb");
            doc.fillColor("black");
          }

          // Column 0: No
          doc.text(String(index + 1), h0.x, y + 4, {
            width: h0.w,
            align: "center",
          });

          // Column 1: Nama Peminjam (NIS)
          const nameWrapHeight = doc.heightOfString(loan.user.name, { width: h1.w });
          doc
            .font("Helvetica-Bold")
            .text(loan.user.name, h1.x, y + 4, { width: h1.w });
          
          let subText = `NIS: ${loan.user.nis || "-"}`;
          if (loan.user.class) {
            subText += `\nKelas: ${loan.user.class}`;
          }

          doc
            .font("Helvetica")
            .fontSize(6.5)
            .text(subText, h1.x, y + 4 + nameWrapHeight, { width: h1.w });

          // Column 2: Judul Buku
          doc
            .font("Helvetica")
            .fontSize(7)
            .text(titleText, h2.x, y + 4, { width: h2.w });

          // Column 3: Tgl Pinjam
          doc.text(
            loan.loanDate ? formatDate(loan.loanDate) : "-",
            h3.x,
            y + 4,
            { width: h3.w, align: "center" },
          );

          // Column 4: Tenggat
          doc.text(
            loan.dueDate ? formatDate(loan.dueDate) : "-",
            h4.x,
            y + 4,
            { width: h4.w, align: "center" },
          );

          // Column 5: Tgl Kembali
          doc.text(
            loan.returnDate ? formatDate(loan.returnDate) : "-",
            h5.x,
            y + 4,
            { width: h5.w, align: "center" },
          );

          // Column 6: Status
          doc
            .font("Helvetica-Bold")
            .text(statusText, h6.x, y + 4, { width: h6.w, align: "center" });

          // Column 7: Kondisi
          doc
            .font("Helvetica")
            .text(conditionText, h7.x, y + 4, { width: h7.w, align: "center" });

          // Draw row bottom border
          doc
            .moveTo(leftMargin, y + rowHeight)
            .lineTo(leftMargin + width, y + rowHeight)
            .lineWidth(0.5)
            .stroke();

          // Draw vertical column separators inside rows
          headers.forEach((h) => {
            doc
              .moveTo(h.x, y)
              .lineTo(h.x, y + rowHeight)
              .stroke();
          });
          doc
            .moveTo(leftMargin + width, y)
            .lineTo(leftMargin + width, y + rowHeight)
            .stroke();

          doc.y = y + rowHeight;
        });
      }

      // Signature
      if (doc.y > 650) {
        doc.addPage();
      }
      doc.moveDown(2);

      const sigX = leftMargin + width - 170;
      doc.fontSize(8);
      doc.text(`Tangerang Selatan, ${formatDate(new Date())}`, sigX, doc.y, {
        width: 170,
        align: "center",
      });
      doc.moveDown(0.3);
      doc
        .font("Helvetica-Bold")
        .text("Mengetahui, Petugas Perpustakaan", sigX, doc.y, {
          width: 170,
          align: "center",
        });
      doc.moveDown(4);
      doc
        .font("Helvetica")
        .text(
          "(...................................................)",
          sigX,
          doc.y,
          { width: 170, align: "center" },
        );

      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);

        // Temporarily disable bottom margin for this page to prevent auto page breaks
        const oldBottomMargin = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;

        doc.font("Helvetica").fontSize(7).fillColor("gray");
        const footerY = doc.page.height - 35;

        doc.text(`Halaman ${i + 1} dari ${range.count}`, leftMargin, footerY, {
          width: width,
          align: "center",
        });

        // Restore bottom margin
        doc.page.margins.bottom = oldBottomMargin;
      }

      doc.end();
    } catch (error) {
      next(error);
    }
  },
};
