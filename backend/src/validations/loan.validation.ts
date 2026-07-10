import { z } from "zod";
import { BookCondition } from "../../generated/prisma/index.js";

export const createLoanSchema = z.object({
  bookId: z.coerce.number("bookId wajib diisi").int().positive(),
});

export const rejectLoanSchema = z.object({
  adminNote: z.string().max(500, "Catatan admin maksimal 500 karakter").optional(),
});

export const returnLoanSchema = z.object({
  bookCondition: z.nativeEnum(BookCondition, {
    message: "Kondisi buku harus bernilai GOOD, DAMAGED, atau LOST",
  }),
  adminNote: z.string().max(500, "Catatan admin maksimal 500 karakter").optional(),
}).superRefine((data, ctx) => {
  if ((data.bookCondition === BookCondition.DAMAGED || data.bookCondition === BookCondition.LOST) && (!data.adminNote || data.adminNote.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Catatan admin (adminNote) wajib diisi jika buku RUSAK atau HILANG",
      path: ["adminNote"],
    });
  }
});
