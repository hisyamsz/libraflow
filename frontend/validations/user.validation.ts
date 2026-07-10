import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama lengkap wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  nis: z
    .string()
    .trim()
    .min(1, "NIS wajib diisi")
    .max(20, "NIS maksimal 20 digit")
    .regex(/^\d+$/, "NIS harus berupa angka saja"),
  role: z.enum(["ADMIN", "MEMBER"], {
    message: "Pilih Role yang valid (ADMIN/MEMBER)",
  }),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(100, "Email maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?[0-9.-]+)?$/, "Format nomor telepon tidak valid")
    .max(15, "Nomor telepon maksimal 15 karakter")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Password minimal harus 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
  class: z.string().trim().max(50).optional().or(z.literal("")),
});

export const editUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama lengkap wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  nis: z
    .string()
    .trim()
    .min(1, "NIS wajib diisi")
    .max(20, "NIS maksimal 20 digit")
    .regex(/^\d+$/, "NIS harus berupa angka saja"),
  role: z.enum(["ADMIN", "MEMBER"], {
    message: "Pilih Role yang valid (ADMIN/MEMBER)",
  }),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(100, "Email maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?[0-9.-]+)?$/, "Format nomor telepon tidak valid")
    .max(15, "Nomor telepon maksimal 15 karakter")
    .optional()
    .or(z.literal("")),
  class: z.string().trim().max(50).optional().or(z.literal("")),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
export type EditUserForm = z.infer<typeof editUserSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Password lama minimal harus 6 karakter"),
    newPassword: z
      .string()
      .min(6, "Password baru minimal harus 6 karakter")
      .max(100, "Password baru maksimal 100 karakter"),
    confirmNewPassword: z
      .string()
      .min(6, "Konfirmasi password baru minimal harus 6 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi password baru tidak sesuai dengan password baru",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Password baru tidak boleh sama dengan password lama",
    path: ["newPassword"],
  });

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
