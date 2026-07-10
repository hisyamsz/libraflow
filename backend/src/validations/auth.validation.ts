import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid").max(100, "Email maksimal 100 karakter").optional(),
  password: z.string().min(6, "Password minimal 6 karakter").max(100, "Password maksimal 100 karakter"),
  nis: z
    .string()
    .min(1, "NIS wajib diisi")
    .max(20, "NIS maksimal 20 karakter")
    .regex(/^\d+$/, "NIS harus berupa angka"),
  phone: z.string().max(15, "Nomor telepon maksimal 15 karakter").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email atau NIS wajib diisi").max(100, "Identifier maksimal 100 karakter"),

  password: z.string().min(1, "Password wajib diisi").max(100, "Password maksimal 100 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
