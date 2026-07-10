import type { Response, NextFunction } from "express";
import type { IReqUser } from "../utils/interface.js";

/**
 * Middleware untuk mendeteksi preferensi bahasa dari setiap HTTP request.
 *
 * Urutan prioritas deteksi bahasa:
 * 1. Query parameter   → ?lang=en  atau  ?lang=id
 * 2. Cookie           → lang=en  (via cookie-parser atau raw header)
 * 3. HTTP Header      → Accept-Language: en  atau  Accept-Language: id
 * 4. Default          → "id" (Bahasa Indonesia)
 *
 * Bahasa yang didukung: "id" (Indonesia) dan "en" (Inggris).
 * Kode bahasa lain atau tidak dikenali akan di-fallback ke "id".
 *
 * @example
 * // Client mengirim: GET /api/books?lang=en
 * // req.lang === "en"
 *
 * // Client mengirim: GET /api/books (tanpa lang)
 * // req.lang === "id"  ← default
 */
export const localeMiddleware = (
  req: IReqUser,
  _res: Response,
  next: NextFunction,
) => {
  // 1. Ambil dari query param (?lang=)
  let lang = req.query.lang as string | undefined;

  // 2. Ambil dari cookies — dua cara:
  //    a) Via cookie-parser middleware (req.cookies)
  //    b) Manual parsing dari raw Cookie header (fallback aman tanpa dependency)
  if (!lang) {
    if (req.cookies && req.cookies.lang) {
      lang = req.cookies.lang;
    } else {
      const cookieHeader = req.headers.cookie;
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader
            .split(";")
            .map((c) => c.trim().split("="))
            .filter((pair): pair is [string, string] => pair.length === 2 && pair[0] !== undefined && pair[1] !== undefined)
            .map(([k, v]) => [k.trim(), decodeURIComponent(v.trim())])
        );
        if (cookies.lang) lang = cookies.lang;
      }
    }
  }

  // 3. Jika tidak ada di query & cookies, cek HTTP Header Accept-Language
  if (!lang) {
    const acceptLang = req.headers["accept-language"];
    if (acceptLang) {
      // Ambil kode bahasa utama saja, buang quality factor dan kode wilayah
      // Contoh: "en-US,en;q=0.9,id;q=0.8" → split(",")[0] = "en-US"
      //         → split(";")[0] = "en-US" → split("-")[0] = "en"
      // Contoh bug lama: "en;q=0.9" → split("-") = ["en;q=0.9"] (tidak terbuang!)
      // Perbaikan: tambah split(";") terlebih dahulu sebelum split("-")
      lang = acceptLang.split(",")[0]?.split(";")[0]?.split("-")[0]?.trim();
    }
  }

  // 3. Normalisasi & validasi; fallback ke "id" jika bahasa tidak didukung
  const normalizedLang = lang?.toLowerCase();
  req.lang = normalizedLang === "en" ? "en" : "id";

  next();
};
