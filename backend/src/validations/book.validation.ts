import { z } from "zod";

export const createBookSchema = z.object({
  categoryId: z.coerce.number(),
  title: z.string().min(1, "Judul wajib diisi").max(255, "Judul buku maksimal 255 karakter"),
  author: z.string().min(1, "Penulis wajib diisi").max(150, "Nama penulis maksimal 150 karakter"),
  publisher: z.string().max(150, "Nama penerbit maksimal 150 karakter").optional(),
  year: z.coerce.number().optional(),
  isbn: z.string().max(20, "ISBN maksimal 20 karakter").optional(),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  coverImage: z.string().max(500, "URL cover image maksimal 500 karakter").optional(),
  description: z.string().max(2000, "Deskripsi maksimal 2000 karakter").optional(),
});

export const updateBookSchema = createBookSchema.partial();
