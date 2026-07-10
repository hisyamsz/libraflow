/**
 * Prisma select object untuk User — mengecualikan field `password`.
 * Gunakan di mana saja saat include/select user agar password tidak ikut ter-fetch.
 *
 * @example
 * prisma.loan.findMany({ include: { user: { select: userSelect } } })
 */
export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  nis: true,
  phone: true,
  class: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Hapus field `password` dari objek user yang sudah di-fetch.
 * Gunakan ini jika query tidak menggunakan `userSelect` (misal fetch user lengkap untuk validasi).
 *
 * @example
 * const user = await prisma.user.findUnique(...)
 * return response.success(res, sanitizeUser(user))
 */
export function sanitizeUser<T extends { password?: unknown }>(user: T) {
  const { password: _, ...safeUser } = user;
  return safeUser;
}
