/**
 * Mengonversi tingkat kelas dari format angka biasa ke format angka Romawi.
 *
 * Contoh:
 *   "10 IPA 1"  → "X IPA 1"
 *   "11 IPS 2"  → "XI IPS 2"
 *   "12 TKJ 1"  → "XII TKJ 1"
 *   "X IPA 1"   → "X IPA 1"  (sudah dalam format Romawi, tidak diubah)
 *   ""          → ""
 */
export function convertClassToRoman(value: string): string {
  if (!value) return value;
  const trimmed = value.trim();
  return trimmed
    .replace(/^12(\s|$)/i, "XII$1")
    .replace(/^11(\s|$)/i, "XI$1")
    .replace(/^10(\s|$)/i, "X$1");
}
