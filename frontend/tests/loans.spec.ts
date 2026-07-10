import { test, expect } from "@playwright/test";

test.describe("Alur Bisnis Peminjaman & Pengembalian Buku", () => {
  
  test("Anggota mengajukan pinjaman dan Admin menyetujuinya", async ({ page }) => {
    // 1. ANGGOTA: Masuk ke katalog buku
    await page.goto("/dashboard/books");
    await expect(page.locator("h1")).toContainText(/katalog buku/i);
    
    // Cari buku tertentu
    const searchInput = page.getByPlaceholder(/cari buku/i);
    await searchInput.fill("Sistem Informasi");
    await searchInput.press("Enter");
    
    // Klik tombol pinjam pada buku pertama
    const pinjamButton = page.getByRole("button", { name: /pinjam/i }).first();
    await expect(pinjamButton).toBeVisible();
    await pinjamButton.click();
    
    // Konfirmasi di dialog modal peminjaman
    await page.getByRole("button", { name: /konfirmasi/i }).click();
    
    // Pastikan Toast notifikasi muncul bertuliskan sukses
    await expect(page.getByText(/peminjaman berhasil diajukan/i)).toBeVisible();
    
    // 2. ADMIN: Menuju halaman manajemen peminjaman
    await page.goto("/admin/loans");
    await expect(page.locator("h1")).toContainText(/daftar peminjaman/i);
    
    // Cari transaksi pending paling atas
    const rowPending = page.locator("tr").filter({ hasText: "Pending" }).first();
    await expect(rowPending).toBeVisible();
    
    // Klik aksi 'Setujui'
    await rowPending.getByRole("button", { name: /aksi/i }).click();
    await page.getByRole("menuitem", { name: /setujui peminjaman/i }).click();
    
    // Konfirmasi persetujuan di dialog modal
    await page.getByRole("button", { name: /ya, setujui/i }).click();
    
    // Toast notifikasi sukses admin menyetujui peminjaman
    await expect(page.getByText(/peminjaman disetujui/i)).toBeVisible();
  });
});
