/**
 * Kamus terjemahan bilingual (Bahasa Indonesia & Bahasa Inggris).
 * Bahasa Indonesia adalah bahasa default.
 *
 * Cara menambahkan pesan baru:
 * 1. Tambahkan key di dalam kategori yang sesuai (atau buat kategori baru).
 * 2. Sediakan teks "id" (Indonesia) DAN "en" (Inggris).
 * 3. Di controller, gunakan format key: "kategori.namaKey" (contoh: "auth.loginSuccess").
 */
export const dictionary = {
  // ─── Pesan Umum ──────────────────────────────────────────────────────────────
  common: {
    unauthorized: {
      id: "Akses tidak sah. Silakan login terlebih dahulu.",
      en: "Unauthorized access. Please login first.",
    },
    forbidden: {
      id: "Anda tidak memiliki hak akses untuk melakukan aksi ini.",
      en: "You do not have permission to perform this action.",
    },
    notFound: {
      id: "Data tidak ditemukan.",
      en: "Data not found.",
    },
    badRequest: {
      id: "Permintaan tidak valid.",
      en: "Bad request.",
    },
    internalServerError: {
      id: "Terjadi kesalahan internal pada server.",
      en: "Internal server error occurred.",
    },
    validationError: {
      id: "Validasi data gagal.",
      en: "Data validation failed.",
    },
    invalidId: {
      id: "ID tidak valid.",
      en: "Invalid ID.",
    },
    duplicateData: {
      id: "Duplikasi data pada {field}. Nilai tersebut sudah digunakan.",
      en: "Duplicate data on field {field}. This value is already in use.",
    },
    foreignKeyViolation: {
      id: "Referensi data tidak valid. Data terkait tidak ditemukan.",
      en: "Invalid data reference. Related data not found.",
    },
    dbNotFound: {
      id: "Data tidak ditemukan di database.",
      en: "Data not found in database.",
    },
  },

  // ─── Autentikasi ──────────────────────────────────────────────────────────────
  auth: {
    loginSuccess: {
      id: "Login berhasil.",
      en: "Login successful.",
    },
    invalidCredentials: {
      id: "Email/NIS atau password salah.",
      en: "Invalid email/NIS or password.",
    },
    userNotFound: {
      id: "Akun pengguna tidak ditemukan.",
      en: "User account not found.",
    },
    profileSuccess: {
      id: "Berhasil mengambil data profil.",
      en: "Successfully retrieved profile data.",
    },
    unauthenticated: {
      id: "Anda belum terautentikasi.",
      en: "You are not authenticated.",
    },
  },

  // ─── Manajemen User ───────────────────────────────────────────────────────────
  user: {
    findAllSuccess: {
      id: "Berhasil mengambil daftar pengguna.",
      en: "Successfully retrieved user list.",
    },
    createSuccess: {
      id: "Pengguna berhasil ditambahkan.",
      en: "User successfully added.",
    },
    updateSuccess: {
      id: "Pengguna berhasil diperbarui.",
      en: "User successfully updated.",
    },
    deleteSuccess: {
      id: "Pengguna berhasil dihapus.",
      en: "User successfully deleted.",
    },
    notFound: {
      id: "Pengguna tidak ditemukan.",
      en: "User not found.",
    },
    invalidId: {
      id: "ID pengguna tidak valid.",
      en: "Invalid user ID.",
    },
    nisAlreadyUsed: {
      id: "NIS sudah digunakan.",
      en: "NIS is already in use.",
    },
    emailAlreadyUsed: {
      id: "Email sudah digunakan.",
      en: "Email is already in use.",
    },
    nisAlreadyUsedByOther: {
      id: "NIS sudah digunakan oleh pengguna lain.",
      en: "NIS is already in use by another user.",
    },
    emailAlreadyUsedByOther: {
      id: "Email sudah digunakan oleh pengguna lain.",
      en: "Email is already in use by another user.",
    },
    selfDemotionForbidden: {
      id: "Anda tidak dapat menurunkan role administratif Anda sendiri untuk mencegah hilangnya hak akses sistem.",
      en: "You cannot demote your own administrative role to prevent loss of system access.",
    },
    selfDeletionForbidden: {
      id: "Anda tidak dapat menghapus akun administrator Anda sendiri yang sedang aktif.",
      en: "You cannot delete your own active administrator account.",
    },
    hasActiveLoan: {
      id: "Tidak dapat menghapus pengguna karena masih memiliki peminjaman aktif.",
      en: "Cannot delete user because they still have active loans.",
    },
    hasLoanHistory: {
      id: "Pengguna tidak dapat dihapus permanen karena masih terikat dengan data riwayat transaksi perpustakaan.",
      en: "User cannot be permanently deleted as they are linked to library transaction history.",
    },
    changePasswordSuccess: {
      id: "Password berhasil diperbarui.",
      en: "Password successfully updated.",
    },
    resetPasswordSuccess: {
      id: "Password pengguna berhasil di-reset kembali ke NIS awal.",
      en: "User password successfully reset to their NIS.",
    },
    selfResetForbidden: {
      id: "Anda tidak dapat me-reset kata sandi Anda sendiri menggunakan fitur administratif ini. Silakan gunakan fitur Ganti Sandi Mandiri.",
      en: "You cannot reset your own password using this administrative feature. Please use the Change Password feature instead.",
    },
    wrongOldPassword: {
      id: "Password lama tidak sesuai.",
      en: "Old password does not match.",
    },
    samePasswordForbidden: {
      id: "Password baru tidak boleh sama dengan password lama.",
      en: "New password must be different from the old password.",
    },
    // Import Excel
    importFileRequired: {
      id: "File Excel wajib diunggah.",
      en: "An Excel file is required.",
    },
    importNoSheet: {
      id: "File Excel tidak memiliki sheet yang valid.",
      en: "The Excel file does not contain a valid sheet.",
    },
    importReadFailed: {
      id: "Gagal membaca sheet Excel.",
      en: "Failed to read the Excel sheet.",
    },
    importFileEmpty: {
      id: "File Excel kosong.",
      en: "The Excel file is empty.",
    },
    importValidationFailed: {
      id: "Validasi file Excel gagal.",
      en: "Excel file validation failed.",
    },
    importSuccess: {
      id: "Semua data pengguna berhasil diimpor dari file Excel.",
      en: "All user data successfully imported from Excel file.",
    },
    importPartialSkipped: {
      id: "Berhasil mengimpor data. Catatan: {count} data dilewati karena NIS/Email sudah terdaftar.",
      en: "Data import successful. Note: {count} records were skipped because NIS/Email already exists.",
    },
    importPartialFailed: {
      id: "Beberapa baris gagal diimpor atau memiliki format tidak valid.",
      en: "Some rows failed to import or have an invalid format.",
    },
  },

  // ─── Buku ─────────────────────────────────────────────────────────────────────
  book: {
    findAllSuccess: {
      id: "Berhasil mengambil daftar buku.",
      en: "Successfully retrieved book list.",
    },
    findOneSuccess: {
      id: "Berhasil mengambil detail buku.",
      en: "Successfully retrieved book detail.",
    },
    createSuccess: {
      id: "Buku berhasil ditambahkan.",
      en: "Book successfully added.",
    },
    updateSuccess: {
      id: "Buku berhasil diperbarui.",
      en: "Book successfully updated.",
    },
    deleteSuccess: {
      id: "Buku berhasil dihapus.",
      en: "Book successfully deleted.",
    },
    notFound: {
      id: "Buku tidak ditemukan.",
      en: "Book not found.",
    },
    invalidId: {
      id: "ID buku tidak valid.",
      en: "Invalid book ID.",
    },
    isbnAlreadyUsed: {
      id: "ISBN sudah digunakan oleh buku lain.",
      en: "ISBN is already in use by another book.",
    },
    stockEmpty: {
      id: "Stok buku habis.",
      en: "Book stock is empty.",
    },
  },

  // ─── Kategori ─────────────────────────────────────────────────────────────────
  category: {
    findAllSuccess: {
      id: "Berhasil mengambil daftar kategori.",
      en: "Successfully retrieved category list.",
    },
    findOneSuccess: {
      id: "Berhasil mengambil detail kategori.",
      en: "Successfully retrieved category detail.",
    },
    createSuccess: {
      id: "Kategori berhasil ditambahkan.",
      en: "Category successfully added.",
    },
    updateSuccess: {
      id: "Kategori berhasil diperbarui.",
      en: "Category successfully updated.",
    },
    deleteSuccess: {
      id: "Kategori berhasil dihapus.",
      en: "Category successfully deleted.",
    },
    notFound: {
      id: "Kategori tidak ditemukan.",
      en: "Category not found.",
    },
    invalidId: {
      id: "ID kategori tidak valid.",
      en: "Invalid category ID.",
    },
    alreadyExists: {
      id: "Kategori dengan nama tersebut sudah ada.",
      en: "A category with this name already exists.",
    },
  },

  // ─── Peminjaman Buku ──────────────────────────────────────────────────────────
  loan: {
    memberOnly: {
      id: "Hanya akun dengan role MEMBER yang dapat meminjam buku.",
      en: "Only accounts with the MEMBER role can borrow books.",
    },
    overdueBlock: {
      id: "Akun diblokir sementara karena Anda memiliki buku yang terlambat dikembalikan.",
      en: "Account temporarily blocked because you have overdue books.",
    },
    limitReached: {
      id: "Limit peminjaman tercapai. Anda hanya boleh meminjam maksimal {limit} buku secara bersamaan.",
      en: "Borrowing limit reached. You can only borrow a maximum of {limit} books simultaneously.",
    },
    duplicateLoan: {
      id: "Anda masih meminjam atau dalam proses pengajuan untuk buku ini.",
      en: "You are still borrowing or pending approval for this book.",
    },
    stockEmpty: {
      id: "Stok buku habis.",
      en: "Book stock is empty.",
    },
    approveStockEmpty: {
      id: "Gagal menyetujui peminjaman karena stok buku telah habis.",
      en: "Failed to approve loan because book stock is empty.",
    },
    invalidStatus: {
      id: "Status peminjaman tidak valid.",
      en: "Invalid loan status.",
    },
    invalidId: {
      id: "ID peminjaman tidak valid.",
      en: "Invalid loan ID.",
    },
    notFound: {
      id: "Data peminjaman tidak ditemukan.",
      en: "Loan record not found.",
    },
    alreadyProcessed: {
      id: "Peminjaman sudah diproses sebelumnya.",
      en: "This loan has already been processed.",
    },
    alreadyProcessedApprove: {
      id: "Peminjaman sudah diproses sebelumnya dan tidak bisa disetujui.",
      en: "This loan has already been processed and cannot be approved.",
    },
    alreadyProcessedReject: {
      id: "Peminjaman sudah diproses sebelumnya dan tidak bisa ditolak.",
      en: "This loan has already been processed and cannot be rejected.",
    },
    mustBeApproved: {
      id: "Pengembalian hanya berlaku untuk buku yang sedang dipinjam (status APPROVED).",
      en: "Return is only applicable for books that are currently borrowed (APPROVED status).",
    },
    findAllSuccess: {
      id: "Berhasil mengambil semua data peminjaman.",
      en: "Successfully retrieved all loan data.",
    },
    findMyLoansSuccess: {
      id: "Berhasil mengambil riwayat peminjaman pribadi.",
      en: "Successfully retrieved personal loan history.",
    },
    createSuccess: {
      id: "Pengajuan peminjaman berhasil dibuat.",
      en: "Loan request successfully created.",
    },
    approveSuccess: {
      id: "Peminjaman berhasil disetujui.",
      en: "Loan successfully approved.",
    },
    rejectSuccess: {
      id: "Peminjaman berhasil ditolak.",
      en: "Loan successfully rejected.",
    },
    returnSuccess: {
      id: "Pengembalian buku berhasil diproses.",
      en: "Book return successfully processed.",
    },
  },

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  dashboard: {
    statsSuccess: {
      id: "Berhasil mengambil statistik dashboard.",
      en: "Successfully retrieved dashboard statistics.",
    },
    myStatsSuccess: {
      id: "Berhasil mengambil statistik personal.",
      en: "Successfully retrieved personal statistics.",
    },
    unauthenticated: {
      id: "Pengguna tidak terautentikasi.",
      en: "User is not authenticated.",
    },
  },

  // ─── Pesan Validasi Input (Zod) ──────────────────────────────────────────────
  validation: {
    required: {
      id: "{field} wajib diisi",
      en: "{field} is required",
    },
    invalidFormat: {
      id: "Format {field} tidak valid",
      en: "Format of {field} is invalid",
    },
    tooSmall: {
      id: "{field} minimal berisi {limit} karakter/nilai",
      en: "{field} must be at least {limit} characters/values",
    },
    tooBig: {
      id: "{field} maksimal berisi {limit} karakter/nilai",
      en: "{field} must be at most {limit} characters/values",
    },
    invalidType: {
      id: "Diharapkan tipe {expected}, diterima {received}",
      en: "Expected type {expected}, received {received}",
    },
    invalidEnumValue: {
      id: "Nilai tidak valid. Diharapkan salah satu dari: {options}",
      en: "Invalid value. Expected one of: {options}",
    },
  },
} as const;
