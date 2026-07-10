const cache = new Map<string, any>();

const getNumberFormat = (locale: string, options?: Intl.NumberFormatOptions) => {
  const cacheKey = `num_${locale}_${JSON.stringify(options ?? {})}`;
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, new Intl.NumberFormat(locale, options));
  }
  return cache.get(cacheKey)!;
};

const getDateTimeFormat = (locale: string, options?: Intl.DateTimeFormatOptions) => {
  const cacheKey = `date_${locale}_${JSON.stringify(options ?? {})}`;
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, new Intl.DateTimeFormat(locale, options));
  }
  return cache.get(cacheKey)!;
};

export const formatter = {
  /**
   * Format mata uang (Currency)
   * Mengembalikan string dengan format mata uang sesuai bahasa target.
   * Contoh ID: "Rp 1.000"
   * Contoh EN: "IDR 1,000"
   */
  currency: (value: number, lang: "id" | "en") => {
    const locale = lang === "id" ? "id-ID" : "en-US";
    return getNumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  },

  /**
   * Format Tanggal (Date)
   * Mengembalikan string tanggal yang sesuai dengan bahasa target.
   * Contoh ID: "30 Mei 2026"
   * Contoh EN: "May 30, 2026"
   */
  date: (date: Date, lang: "id" | "en") => {
    const locale = lang === "id" ? "id-ID" : "en-US";
    return getDateTimeFormat(locale, {
      dateStyle: "medium",
    }).format(date);
  },

  /**
   * Format Angka (Number)
   * Mengembalikan angka dengan pemisah ribuan.
   * Contoh ID: "1.000"
   * Contoh EN: "1,000"
   */
  number: (value: number, lang: "id" | "en") => {
    const locale = lang === "id" ? "id-ID" : "en-US";
    return getNumberFormat(locale).format(value);
  },
};

/**
 * Mengonversi tingkat kelas dari format angka ke angka Romawi.
 * "10 IPA 1" → "X IPA 1"
 * "11 IPS 2" → "XI IPS 2"
 * "12 TKJ 1" → "XII TKJ 1"
 * Jika sudah dalam format Romawi atau tidak dikenali, dikembalikan apa adanya.
 */
export function convertClassToRoman(classStr: string | null | undefined): string | null {
  if (!classStr) return null;
  const trimmed = classStr.trim();
  return trimmed
    .replace(/^12(\s|$)/i, "XII$1")
    .replace(/^11(\s|$)/i, "XI$1")
    .replace(/^10(\s|$)/i, "X$1")
    .replace(/^9(\s|$)/i, "IX$1")
    .replace(/^8(\s|$)/i, "VIII$1")
    .replace(/^7(\s|$)/i, "VII$1");
}
