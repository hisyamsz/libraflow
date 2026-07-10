import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Nama kategori wajib diisi")
    .max(100, "Nama kategori maksimal 100 karakter")
    .trim(),

  description: z
    .string()
    .max(255, "Deskripsi maksimal 255 karakter")
    .optional()
    .nullable(),
});
