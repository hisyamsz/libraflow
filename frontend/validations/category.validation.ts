import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nama kategori tidak boleh kosong")
    .max(100, "Nama kategori maksimal 100 karakter"),
  description: z
    .string()
    .max(255, "Deskripsi maksimal 255 karakter")
    .optional(),
});

export type CategoryForm = z.infer<typeof categorySchema>;
