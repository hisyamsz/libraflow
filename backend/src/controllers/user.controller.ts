import type { Request, Response, NextFunction } from "express";
import type { IReqUser } from "../utils/interface.js";
import { prisma } from "../lib/prisma.js";
import response from "../utils/response.js";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
} from "../validations/user.validation.js";
import { hashPassword, verifyPassword } from "../utils/encryption.js";
import { sanitizeUser, userSelect } from "../utils/user.js";
import { Role } from "../../generated/prisma/index.js";
import * as xlsx from "xlsx";
import { getPaginationParams } from "../utils/pagination.js";
import { convertClassToRoman } from "../utils/formatter.js";

export default {
  /**
   * 1. GET /users (List User & Pagination & Search)
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const search = req.query.search as string | undefined;

      // Logika OR untuk pencarian name, nis, atau email
      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { nis: { contains: search } },
          { email: { contains: search } },
        ];
      }

      const [users, count] = await Promise.all([
        prisma.user.findMany({
          where,
          select: userSelect, // ✅ KEAMANAN: Memastikan field password tidak ikut terkirim ke frontend
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.user.count({ where }),
      ]);

      return response.pagination(
        res,
        users,
        {
          current: page,
          total: count,
          totalPage: Math.ceil(count / limit),
        },
        "user.findAllSuccess",
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * 2. POST /users (Tambah User Manual)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = createUserSchema.safeParse(req.body);

      if (!result.success) {
        return next(result.error);
      }

      const { name, email, password, nis, phone, role } = result.data;

      // Konversi format kelas ke Romawi
      const formattedClass = convertClassToRoman(result.data.class);

      // Konsolidasi pengecekan duplikasi NIS & Email (1 query db)
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ nis }, ...(email ? [{ email }] : [])],
        },
      });

      if (existingUser) {
        if (existingUser.nis === nis) {
          return response.badRequest(res, "user.nisAlreadyUsed");
        }
        if (email && existingUser.email === email) {
          return response.badRequest(res, "user.emailAlreadyUsed");
        }
      }

      // Hash password dengan bcrypt
      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          name,
          email: email ?? null,
          password: hashedPassword,
          nis,
          phone: phone ?? null,
          role: role ?? Role.MEMBER,
          class: formattedClass ?? null,
        },
      });

      // ✅ KEAMANAN: Hapus field password dengan sanitizeUser sebelum return
      return response.created(res, sanitizeUser(user), "user.createSuccess");
    } catch (error) {
      next(error);
    }
  },

  /**
   * 3. POST /users/import (Import via Excel)
   * Jika NIS sudah ada di database → UPDATE (upsert), jika belum → INSERT baru.
   */
  async importExcel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return response.badRequest(res, "user.importFileRequired");
      }

      // Parsing buffer Excel menggunakan xlsx
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        return response.badRequest(res, "user.importNoSheet");
      }

      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        return response.badRequest(res, "user.importReadFailed");
      }

      // Ubah baris pertama sheet menjadi JSON array
      const jsonData = xlsx.utils.sheet_to_json<any>(worksheet);

      if (jsonData.length === 0) {
        return response.badRequest(res, "user.importFileEmpty");
      }

      const excelRowSchema = createUserSchema.omit({
        password: true,
        role: true,
      });

      const validatedRows: any[] = [];
      const errors: string[] = [];

      // Gunakan Set untuk memantau duplikasi internal di file Excel
      const uniqueNisSet = new Set<string>();
      const uniqueEmailSet = new Set<string>();

      // Validasi Zod dan persiapan data (looping JSON)
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const rowNum = i + 2; // Baris riil di Excel (mempertimbangkan header)

        const name = row.Nama || row.nama || row.Name || row.name;
        const email = row.Email || row.email;
        const nis = row.NIS || row.nis;
        const phone =
          row.Phone || row.phone || row.Telepon || row.telepon || null;

        // Baca field Kelas
        const rawClass =
          row.Kelas || row.kelas || row.Class || row.class || null;
        const formattedClass = convertClassToRoman(
          rawClass ? String(rawClass).trim() : null,
        );

        // Validasi menggunakan Zod untuk integritas penuh
        const validation = excelRowSchema.safeParse({
          name: name ? String(name).trim() : undefined,
          email: email ? String(email).trim().toLowerCase() : undefined,
          nis: nis ? String(nis).trim() : undefined,
          phone: phone ? String(phone).trim() : undefined,
          class: formattedClass,
        });

        if (!validation.success) {
          const fieldErrors = validation.error.flatten().fieldErrors;
          const errorMsg = Object.entries(fieldErrors)
            .map(([field, errs]) => `${field}: ${errs?.join(", ")}`)
            .join("; ");
          errors.push(`Baris ${rowNum}: ${errorMsg}`);
          continue;
        }

        const currentNis = validation.data.nis;
        const currentEmail = validation.data.email;

        // Cek duplikasi NIS internal (di dalam satu file Excel)
        if (uniqueNisSet.has(currentNis)) {
          errors.push(
            `Baris ${rowNum}: Duplikasi NIS '${currentNis}' di dalam file Excel`,
          );
          continue;
        }
        uniqueNisSet.add(currentNis);

        // Cek duplikasi Email internal
        if (currentEmail) {
          if (uniqueEmailSet.has(currentEmail)) {
            errors.push(
              `Baris ${rowNum}: Duplikasi Email '${currentEmail}' di dalam file Excel`,
            );
            continue;
          }
          uniqueEmailSet.add(currentEmail);
        }

        // Simpan data yang valid
        validatedRows.push({
          ...validation.data,
          passwordRaw: row.Password || row.password || currentNis,
        });
      }

      // Jika ada error validasi kolom pada file Excel, tolak semua proses import
      if (errors.length > 0) {
        return response.badRequest(res, "user.importValidationFailed", errors);
      }

      // Lakukan Upsert: update jika NIS sudah ada, insert jika belum
      let totalCreated = 0;
      let totalUpdated = 0;
      const createdUsers: { name: string; nis: string; class: string | null }[] = [];
      const updatedUsers: { name: string; nis: string; class: string | null }[] = [];

      await prisma.$transaction(async (tx) => {
        for (const row of validatedRows) {
          const existing = await tx.user.findUnique({
            where: { nis: row.nis },
          });

          if (existing) {
            // UPDATE data yang sudah ada
            await tx.user.update({
              where: { id: existing.id },
              data: {
                name: row.name,
                email: row.email ?? null,
                phone: row.phone ?? null,
                class: row.class ?? null,
              },
            });
            totalUpdated++;
            updatedUsers.push({
              name: row.name,
              nis: row.nis,
              class: row.class ?? null,
            });
          } else {
            // INSERT baru
            const hashedPassword = await hashPassword(String(row.passwordRaw));
            await tx.user.create({
              data: {
                name: row.name,
                email: row.email ?? null,
                password: hashedPassword,
                nis: row.nis,
                phone: row.phone ?? null,
                role: Role.MEMBER,
                class: row.class ?? null,
              },
            });
            totalCreated++;
            createdUsers.push({
              name: row.name,
              nis: row.nis,
              class: row.class ?? null,
            });
          }
        }
      });

      return response.success(
        res,
        {
          totalProcessed: validatedRows.length,
          totalCreated,
          totalUpdated,
          totalSuccess: totalCreated + totalUpdated,
          totalFailed: errors.length,
          createdUsers,
          updatedUsers,
          errors: errors.length > 0 ? errors : undefined,
        },
        "user.importSuccess",
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * 4. PUT /users/:id (Update User)
   */
  async update(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = Number(id);

      if (isNaN(userId)) {
        return response.badRequest(res, "user.invalidId");
      }

      const result = updateUserSchema.safeParse(req.body);
      if (!result.success) {
        return next(result.error);
      }

      const { name, email, nis, phone, role, password } = result.data;

      // Konversi format kelas ke Romawi
      const formattedClass = convertClassToRoman(result.data.class);

      // 🚨 PROTEKSI LOCKOUT: Cegah Admin menurunkan role-nya sendiri (Self-Demotion)
      if (
        req.user &&
        userId === req.user.id &&
        role &&
        role !== req.user.role
      ) {
        return response.badRequest(res, "user.selfDemotionForbidden");
      }

      // Cek apakah user target eksis
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        return response.notFound(res, "user.notFound");
      }

      // Cari apakah ada USER LAIN yang menggunakan NIS atau Email yang dikirimkan
      if (nis || email) {
        const duplicateUser = await prisma.user.findFirst({
          where: {
            id: { not: userId }, // ✅ Kecualikan user saat ini secara aman
            OR: [nis ? { nis } : {}, email ? { email } : {}].filter(
              (condition) => Object.keys(condition).length > 0,
            ),
          },
        });

        if (duplicateUser) {
          if (nis && duplicateUser.nis === nis) {
            return response.badRequest(res, "user.nisAlreadyUsedByOther");
          }
          if (email && duplicateUser.email === email) {
            return response.badRequest(res, "user.emailAlreadyUsedByOther");
          }
        }
      }

      const updateData: any = {
        name: name ?? undefined,
        email: email === null ? null : (email ?? undefined),
        nis: nis ?? undefined,
        phone: phone === null ? null : (phone ?? undefined),
        role: role ?? undefined,
        class:
          formattedClass === null ? null : (formattedClass ?? undefined),
      };

      // Reset password opsional jika dikirimkan oleh Admin
      if (password) {
        updateData.password = await hashPassword(password);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return response.success(
        res,
        sanitizeUser(updatedUser),
        "user.updateSuccess",
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * 5. DELETE /users/:id (Remove User)
   */
  async remove(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = Number(id);

      if (isNaN(userId)) {
        return response.badRequest(res, "user.invalidId");
      }

      // 🚨 PROTEKSI LOCKOUT: Cegah Admin menghapus akunnya sendiri (Self-Deletion)
      if (req.user && userId === req.user.id) {
        return response.badRequest(res, "user.selfDeletionForbidden");
      }

      // Cek apakah user target eksis
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        return response.notFound(res, "user.notFound");
      }

      // 🚨 VALIDASI KRITIS: Cek relasi peminjaman (tabel Loan) yang masih aktif
      const activeLoan = await prisma.loan.findFirst({
        where: {
          userId,
          status: {
            in: ["PENDING", "APPROVED"], // Status buku belum dikembalikan ke perpustakaan
          },
        },
      });

      if (activeLoan) {
        return response.badRequest(res, "user.hasActiveLoan");
      }

      // Hapus user jika tidak memiliki peminjaman aktif
      await prisma.user.delete({
        where: { id: userId },
      });

      return response.success(res, null, "user.deleteSuccess");
    } catch (error: any) {
      // Tangkap error Foreign Key Constraint (P2003) jika user memiliki histori pinjaman (RETURNED/REJECTED)
      if (error.code === "P2003") {
        return response.badRequest(res, "user.hasLoanHistory");
      }

      next(error);
    }
  },

  /**
   * 6. PATCH /users/me/change-password (Ganti Sandi Mandiri)
   */
  async changePassword(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user;
      if (!currentUser) {
        return response.unauthorized(res, "common.unauthorized");
      }

      // 1. Validasi Input Body menggunakan Zod
      const result = changePasswordSchema.safeParse(req.body);
      if (!result.success) {
        return next(result.error);
      }

      const { oldPassword, newPassword } = result.data;

      // 2. Cari data user di database
      const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
      });

      if (!user) {
        return response.notFound(res, "user.notFound");
      }

      // 3. Bandingkan password lama dengan database
      const isMatch = await verifyPassword(oldPassword, user.password);
      if (!isMatch) {
        return response.badRequest(res, "user.wrongOldPassword");
      }

      // 4. Pastikan password baru tidak sama dengan password lama
      if (newPassword === oldPassword) {
        return response.badRequest(res, "user.samePasswordForbidden");
      }

      // 5. Hash password baru
      const hashedPassword = await hashPassword(newPassword);

      // 6. Update database
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { password: hashedPassword },
      });

      return response.success(res, null, "user.changePasswordSuccess");
    } catch (error) {
      next(error);
    }
  },

  /**
   * 7. PATCH /users/:id/reset-password (Reset Sandi oleh Admin)
   */
  async resetPassword(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = Number(id);

      if (isNaN(userId)) {
        return response.badRequest(res, "user.invalidId");
      }

      if (req.user && userId === req.user.id) {
        return response.badRequest(res, "user.selfResetForbidden");
      }

      // 1. Cari user untuk mengambil NIS
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return response.notFound(res, "user.notFound");
      }

      // 2. Hash NIS untuk dijadikan password default baru
      const hashedPassword = await hashPassword(user.nis);

      // 3. Update database
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return response.success(res, null, "user.resetPasswordSuccess");
    } catch (error) {
      next(error);
    }
  },
};
