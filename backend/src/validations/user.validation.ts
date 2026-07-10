import { z } from "zod";

// Skema untuk Tambah User Manual
export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.preprocess(
    (val) => (val === "" ? null : val),
    z
      .string()
      .email("Email tidak valid")
      .toLowerCase()
      .max(100, "Email maksimal 100 karakter")
      .optional()
      .nullable(),
  ),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
  nis: z
    .string()
    .min(1, "NIS wajib diisi")
    .max(20, "NIS maksimal 20 karakter")
    .regex(/^\d+$/, "NIS harus berupa angka"),
  phone: z.preprocess(
    (val) => (val === "" ? null : val),
    z
      .string()
      .max(15, "Nomor telepon maksimal 15 karakter")
      .optional()
      .nullable(),
  ),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  class: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().max(50, "Kelas maksimal 50 karakter").optional().nullable(),
  ),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Skema untuk Update User
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .optional(),
  email: z.preprocess(
    (val) => (val === "" ? null : val),
    z
      .string()
      .email("Email tidak valid")
      .toLowerCase()
      .max(100, "Email maksimal 100 karakter")
      .optional()
      .nullable(),
  ),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter")
    .optional(),
  nis: z
    .string()
    .min(1, "NIS wajib diisi")
    .max(20, "NIS maksimal 20 karakter")
    .regex(/^\d+$/, "NIS harus berupa angka")
    .optional(),
  phone: z.preprocess(
    (val) => (val === "" ? null : val),
    z
      .string()
      .max(15, "Nomor telepon maksimal 15 karakter")
      .optional()
      .nullable(),
  ),
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
  class: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().max(50, "Kelas maksimal 50 karakter").optional().nullable(),
  ),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Skema untuk Ganti Password
export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Password lama minimal 6 karakter")
      .max(100, "Password lama maksimal 100 karakter"),
    newPassword: z
      .string()
      .min(6, "Password baru minimal 6 karakter")
      .max(100, "Password baru maksimal 100 karakter"),
    confirmNewPassword: z
      .string()
      .min(6, "Konfirmasi password baru minimal 6 karakter")
      .max(100, "Konfirmasi password maksimal 100 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi password baru tidak sesuai dengan password baru",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
