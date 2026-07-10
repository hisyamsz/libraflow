import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { translate, getZodCustomErrorMap, fieldLabels } from "../utils/i18n.js";
import type { IReqUser } from "../utils/interface.js";

/**
 * Global error handler middleware — menangkap semua error yang di-pass via next(error).
 *
 * Urutan penanganan:
 * 1. SyntaxError — JSON payload rusak/malformed (400)
 * 2. Zod Validation Error (400)
 * 3. Prisma Database Error (404 / 400)
 * 4. Generic / Unknown Error (500)
 *
 * Semua pesan error dikembalikan dalam bahasa yang dipilih pengguna (req.lang),
 * dengan default Bahasa Indonesia.
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const lang = (req as IReqUser).lang ?? "id";

  // 0. Tangkap SyntaxError — JSON payload rusak/malformed
  //    Body-parser melempar SyntaxError sebelum request masuk ke controller.
  //    Tanpa handler ini, Express mengembalikan halaman HTML error yang tidak terstandardisasi.
  if (
    err instanceof SyntaxError &&
    "status" in err &&
    (err as any).status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      meta: {
        status: 400,
        message:
          lang === "en"
            ? "Invalid JSON format in request body."
            : "Format JSON pada body request tidak valid.",
      },
      data: null,
    });
  }

  // 1. Tangkap Zod Validation Error
  if (err instanceof ZodError) {
    // Terapkan Custom Zod Error Map dinamis sesuai req.lang
    const customMap = getZodCustomErrorMap(lang);
    const mappedIssues = err.issues.map((issue: any) => {
      const result = customMap(issue);
      const message = typeof result === "string" ? result : (result?.message ?? issue.message);
      return { ...issue, message };
    });
    const newErr = new ZodError(mappedIssues);
    const formatted = newErr.flatten().fieldErrors;
    
    return res.status(400).json({
      meta: {
        status: 400,
        message: translate("common.validationError", lang),
      },
      data: formatted,
    });
  }

  // 2. Tangkap Prisma Database Error
  if (err?.code?.startsWith?.("P")) {
    const prismaCode: string = err.code;

    // P2025 — Record tidak ditemukan saat operasi update/delete
    if (prismaCode === "P2025") {
      return res.status(404).json({
        meta: {
          status: 404,
          message: translate("common.dbNotFound", lang),
        },
        data: null,
      });
    }

    // P2002 — Pelanggaran Unique Constraint (misalnya email/nis duplikat)
    if (prismaCode === "P2002") {
      let targetField = err.meta?.target ?? "field";
      if (Array.isArray(targetField)) {
         targetField = targetField[0];
      }
      
      // Bersihkan nama index MariaDB/MySQL (contoh: "User_nis_key" -> "nis")
      let cleanedField = String(targetField);
      if (cleanedField.includes("_")) {
        // Ambil bagian tengah jika formatnya Model_field_key atau model_field_idx
        const parts = cleanedField.split("_");
        if (parts.length >= 2 && parts[1]) {
          // Jika formatnya User_nis_key, maka parts[1] adalah "nis"
          cleanedField = parts[1];
        }
      }

      const fieldEntry = fieldLabels[cleanedField];
      const label = fieldEntry ? fieldEntry[lang] : cleanedField;

      return res.status(400).json({
        meta: {
          status: 400,
          message: translate("common.duplicateData", lang, { field: label }),
        },
        data: prismaCode,
      });
    }

    // P2003 — Pelanggaran Foreign Key Constraint
    if (prismaCode === "P2003") {
      return res.status(400).json({
        meta: {
          status: 400,
          message: translate("common.foreignKeyViolation", lang),
        },
        data: prismaCode,
      });
    }

    // Prisma error umum lainnya
    return res.status(400).json({
      meta: {
        status: 400,
        message: err.message || translate("common.badRequest", lang),
      },
      data: prismaCode,
    });
  }

  // 3. Tangkap Generic Error (500)
  const statusCode: number = err.status || err.statusCode || 500;

  // Cek apakah pesan error adalah translation key atau teks biasa
  const rawMessage: string = err.message || "common.internalServerError";
  const message = translate(rawMessage, lang);

  console.error("Global Error Caught:", err);

  return res.status(statusCode).json({
    meta: {
      status: statusCode,
      message,
    },
    data: process.env.NODE_ENV !== "production" ? err.stack : null,
  });
};
