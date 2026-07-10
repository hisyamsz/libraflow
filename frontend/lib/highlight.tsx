import React from "react";

/**
 * Menyorot (highlight) bagian teks yang cocok dengan kata kunci pencarian.
 * Mengembalikan ReactNode dengan elemen <mark> di bagian yang cocok.
 *
 * @param text  - Teks yang akan diproses (bisa berupa string atau ReactNode)
 * @param search - Kata kunci pencarian
 * @returns ReactNode dengan bagian yang cocok disorot
 *
 * @example
 * highlightText("John Doe", "john")
 * // Returns: [<mark>John</mark>, " Doe"]
 */
export function highlightText(
  text: React.ReactNode,
  search: string,
): React.ReactNode {
  if (typeof text !== "string") return text; // Safe fallback for non-string types
  if (!search.trim()) return text;

  const regex = new RegExp(
    `(${search.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="rounded bg-yellow-500/20 px-0.5 text-yellow-900 dark:text-yellow-100"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
