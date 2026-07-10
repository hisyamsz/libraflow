import { z } from "zod";

export const returnLoanSchema = z.object({
  bookCondition: z.enum(["GOOD", "DAMAGED", "LOST"]),
  adminNote: z.string().max(500, "Catatan admin maksimal 500 karakter").optional(),
}).superRefine((data, ctx) => {
  if (
    (data.bookCondition === "DAMAGED" || data.bookCondition === "LOST") &&
    (!data.adminNote || data.adminNote.trim() === "")
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Catatan wajib diisi jika buku rusak atau hilang",
      path: ["adminNote"],
    });
  }
});

export type ReturnLoanForm = z.infer<typeof returnLoanSchema>;

export const rejectLoanSchema = z.object({
  adminNote: z.string().min(1, "Alasan penolakan wajib diisi").max(500, "Alasan penolakan maksimal 500 karakter"),
});

export type RejectLoanForm = z.infer<typeof rejectLoanSchema>;
