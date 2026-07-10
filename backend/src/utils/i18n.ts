import { dictionary } from "./i18n-dictionary.js";
import type { TranslationKey, TranslationParams } from "../types/i18n-generated.js";

// Ekspor agar tetap bisa diimpor dari file ini (backward compatibility)
export { dictionary };
export type { TranslationKey, TranslationParams };

/**
 * Daftar nama kolom database yang dikenal memiliki potensi constraint error.
 * Type ini memastikan setiap field yang mungkin muncul di Prisma P2002 error
 * WAJIB memiliki label ramah pengguna yang terdaftar di fieldLabels.
 * Jika ada kolom baru dengan unique constraint, tambahkan di sini!
 */
export type KnownDbField =
  // User model
  | "nis"
  | "email"
  | "phone"
  | "name"
  | "password"
  | "oldPassword"
  | "newPassword"
  | "confirmNewPassword"
  | "role"
  | "class"
  // Book model
  | "isbn"
  | "title"
  | "author"
  | "publisher"
  | "year"
  | "stock"
  | "coverImage"
  | "description"
  | "categoryId"
  | "identifier"
  // Loan model
  | "userId"
  | "bookId"
  | "adminNote"
  | "bookCondition";

export const fieldLabels: Partial<Record<KnownDbField, { id: string; en: string }>> & Record<string, { id: string; en: string }> = {
  nis: { id: "NIS", en: "NIS" },
  email: { id: "Email", en: "Email" },
  isbn: { id: "ISBN", en: "ISBN" },
  phone: { id: "Nomor Telepon", en: "Phone Number" },
  name: { id: "Nama", en: "Name" },
  title: { id: "Judul", en: "Title" },
  userId: { id: "Pengguna", en: "User" },
  bookId: { id: "Buku", en: "Book" },
  password: { id: "Password", en: "Password" },
  oldPassword: { id: "Password Lama", en: "Old Password" },
  newPassword: { id: "Password Baru", en: "New Password" },
  confirmNewPassword: { id: "Konfirmasi Password Baru", en: "Confirm New Password" },
  role: { id: "Role", en: "Role" },
  class: { id: "Kelas", en: "Class" },
  adminNote: { id: "Catatan Admin", en: "Admin Note" },
  bookCondition: { id: "Kondisi Buku", en: "Book Condition" },
  identifier: { id: "Identifier (Email/NIS)", en: "Identifier" },
  categoryId: { id: "Kategori", en: "Category" },
  author: { id: "Penulis", en: "Author" },
  publisher: { id: "Penerbit", en: "Publisher" },
  year: { id: "Tahun", en: "Year" },
  stock: { id: "Stok", en: "Stock" },
  coverImage: { id: "Gambar Sampul", en: "Cover Image" },
  description: { id: "Deskripsi", en: "Description" },
};

export const getZodCustomErrorMap = (lang: "id" | "en"): any => {
  return (issue: any) => {
    const defaultError = issue.message ?? "Invalid input";
    if (lang === "en") return { message: defaultError };

    // Poin 3: Sanitasi jalur bersarang — filter indeks angka, ambil nama string terakhir
    // Contoh: path ["books", 0, "id"] → fieldName = "id"
    const fieldName = [...(issue.path as any[])]
      .filter((p): p is string => typeof p === "string")
      .pop();

    const fieldLabel =
      fieldName && fieldLabels[fieldName]
        ? fieldLabels[fieldName][lang]
        : fieldName ?? "Data";

    let message = defaultError;
    switch (issue.code) {
      case "invalid_type":
        let received = issue.received;
        if (typeof received === "undefined") {
          if (typeof issue.input !== "undefined") {
            received = typeof issue.input;
          } else if (issue.message) {
            const match = issue.message.match(/received\s+([a-zA-Z0-9_]+)/);
            if (match) {
              received = match[1];
            }
          }
        }
        if (typeof received === "undefined") {
          received = "undefined";
        }

        if (received === "undefined") {
          // Poin 1: Gunakan translate() ke dictionary.validation
          message = translate("validation.required", lang, { field: fieldLabel });
        } else {
          message = translate("validation.invalidType", lang, {
            expected: issue.expected,
            received: received,
          });
        }
        break;
      case "invalid_string":
      case "invalid_format":
        message = translate("validation.invalidFormat", lang, { field: fieldLabel });
        break;
      case "too_small":
        message = translate("validation.tooSmall", lang, {
          field: fieldLabel,
          limit: issue.minimum,
        });
        break;
      case "too_big":
        message = translate("validation.tooBig", lang, {
          field: fieldLabel,
          limit: issue.maximum,
        });
        break;
      case "invalid_enum_value":
        message = translate("validation.invalidEnumValue", lang, {
          options: (issue.options as string[]).join(", "),
        });
        break;
    }
    return { message };
  };
};

/**
 * Cache untuk mempercepat pencarian terjemahan yang sudah pernah dilakukan.
 * Menggunakan Map untuk pencarian O(1) setelah akses pertama (traversal O(n)).
 */
const translationCache = new Map<string, { id: string; en: string }>();

/**
 * Menerjemahkan sebuah key dari kamus ke dalam bahasa yang dipilih.
 *
 * @param key      - Key dot-notation, contoh: "auth.loginSuccess"
 * @param lang     - Kode bahasa target: "id" (Indonesia) atau "en" (Inggris)
 * @param params   - Objek parameter untuk menggantikan placeholder {nama}, contoh: { limit: 3 }
 * @returns        - String terjemahan. Jika key tidak ditemukan, kembalikan key itu sendiri (safe fallback).
 *
 * @example
 * translate("auth.loginSuccess", "id")
 * // => "Login berhasil."
 *
 * translate("loan.limitReached", "en", { limit: 3 })
 * // => "Borrowing limit reached. You can only borrow a maximum of 3 books simultaneously."
 *
 * translate("Pesan hardcoded lama", "id")
 * // => "Pesan hardcoded lama" (fallback — tidak crash)
 */
export function translate<K extends TranslationKey>(
  key: K | (string & {}),
  lang: "id" | "en",
  params?: TranslationParams<K>,
): string {
  // Cek cache terlebih dahulu untuk lookup O(1)
  if (translationCache.has(key)) {
    const cached = translationCache.get(key)!;
    return interpolate(cached[lang] ?? cached.id, params);
  }

  // Pertama kali: traversal objek dictionary
  const keys = key.split(".");
  let current: any = dictionary;

  // Telusuri dictionary berdasarkan key berformat nested (contoh: "auth.loginSuccess")
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      // Key tidak terdaftar di dictionary → kembalikan teks mentah (safe fallback)
      // Poin 2: Tampilkan peringatan di mode development agar tidak terlewat oleh developer
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] Missing translation key: "${key}"`);
      }
      return interpolate(key, params);
    }
  }

  // Ambil teks terjemahan sesuai bahasa target, fallback ke "id" jika tidak ada
  if (current && typeof current === "object" && "id" in current) {
    // Simpan ke cache agar akses berikutnya O(1)
    translationCache.set(key, current as { id: string; en: string });
    const translatedText = (current as any)[lang] ?? (current as any)["id"];
    if (typeof translatedText === "string") {
      return interpolate(translatedText, params);
    }
  }

  return interpolate(key, params);
}

/**
 * Mengganti placeholder {nama} di dalam teks dengan nilai dari objek params.
 * Menggunakan satu regex global tunggal untuk efisiensi (tidak membuat RegExp baru per iterasi).
 * Di mode development, memperingatkan jika ada placeholder yang tidak tergantikan.
 *
 * @example
 * interpolate("Batas {limit} buku", { limit: 3 })
 * // => "Batas 3 buku"
 *
 * interpolate("Batas {limit} buku", { limitQty: 3 }) // typo parameter
 * // => "Batas {limit} buku" + console.warn di dev mode
 */
function interpolate(
  text: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return text;

  // Satu regex global untuk mencocokkan semua placeholder sekaligus (lebih efisien)
  const result = text.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });

  // Deteksi otomatis placeholder tersisa di mode development (membantu menangkap typo parameter)
  if (process.env.NODE_ENV !== "production") {
    const leftover = result.match(/\{([a-zA-Z0-9_]+)\}/g);
    if (leftover) {
      console.warn(
        `[i18n] Missing parameters for placeholders: ${leftover.join(", ")} in text: "${text}"`,
      );
    }
  }

  return result;
}
