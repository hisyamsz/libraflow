import { test as setup, expect } from "@playwright/test";

const authFile = ".auth/user.json";

setup("authenticate as admin", async ({ page }) => {
  // Masuk ke halaman login
  await page.goto("/login");
  
  // Isi kredensial login (sesuaikan dengan selector di web Anda)
  await page.getByPlaceholder(/masukkan email/i).fill("admin@library.com");
  await page.getByPlaceholder(/masukkan kata sandi/i).fill("password123");
  
  // Klik tombol submit
  await page.getByRole("button", { name: /masuk/i }).click();
  
  // Pastikan berhasil login dengan memeriksa redirect ke dashboard
  await expect(page).toHaveURL(/\/admin|\/dashboard/);
  
  // Simpan state session ke dalam file JSON
  await page.context().storageState({ path: authFile });
});
