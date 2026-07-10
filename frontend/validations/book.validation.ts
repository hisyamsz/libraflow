import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string()
    .min(1, "Judul buku tidak boleh kosong")
    .max(255, "Judul buku maksimal 255 karakter"),
  author: z
    .string()
    .min(1, "Penulis tidak boleh kosong")
    .max(150, "Penulis maksimal 150 karakter"),
  publisher: z
    .string()
    .max(150, "Penerbit maksimal 150 karakter")
    .optional()
    .or(z.literal("")),
  year: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^\d+$/.test(val), "Tahun harus berupa angka")
    .refine((val) => !val || Number(val) >= 1000, "Tahun tidak valid")
    .refine(
      (val) => !val || Number(val) <= new Date().getFullYear(),
      `Tahun tidak boleh melebihi ${new Date().getFullYear()}`,
    ),
  isbn: z
    .string()
    .max(20, "ISBN maksimal 20 karakter")
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^\d+$/.test(val), "ISBN harus berupa angka"),
  description: z
    .string()
    .max(2000, "Deskripsi maksimal 2000 karakter")
    .optional()
    .or(z.literal("")),
  stock: z
    .string()
    .min(1, "Stok tidak boleh kosong")
    .refine((val) => /^\d+$/.test(val), "Stok harus berupa angka")
    .refine((val) => Number(val) >= 0, "Stok tidak boleh negatif"),
  coverImage: z
    .string()
    .url("URL cover tidak valid")
    .optional()
    .or(z.literal("")),
  categoryId: z
    .number({
      message: "Kategori harus dipilih",
    })
    .min(1, "Kategori harus dipilih"),
});

export type BookForm = z.infer<typeof bookSchema>;

export type BookPayload = Omit<
  BookForm,
  "year" | "stock" | "publisher" | "isbn" | "coverImage" | "description"
> & {
  year: number | null;
  stock: number;
  publisher: string;
  isbn: string;
  coverImage: string;
  description: string;
};
