import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

/**
 * Integration Tests untuk Middleware Lokalisasi & Global Error Handler.
 *
 * Skenario yang diuji (sesuai rekomendasi Phase 6 PR Review):
 * 1. Malformed JSON payload \u2192 400 JSON terstandardisasi (bukan HTML error page)
 * 2. Accept-Language: en;q=0.5 \u2192 response dalam bahasa Inggris (bug parsing quality factor)
 * 3. Cookie lang=en \u2192 response dalam bahasa Inggris
 *
 * Cara menjalankan:
 *   npm run test
 */
describe("locale.middleware & error.middleware \u2014 Integration Tests", () => {
  const app = createApp();

  // ─── Test 1: Malformed JSON SyntaxError ──────────────────────────────────
  it("mengembalikan 400 JSON terstandardisasi saat body JSON rusak/malformed", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send("{invalid-json}"); // JSON rusak disengaja

    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toMatchObject({
      meta: {
        status: 400,
      },
      data: null,
    });
    // Pastikan bukan HTML error page bawaan Express
    expect(typeof res.body.meta.message).toBe("string");
    expect(res.body.meta.message).not.toContain("<html");
  });

  // ─── Test 2: Accept-Language dengan quality factor (bug parsing lama) ──────
  it("mendeteksi bahasa Inggris dari Accept-Language: en;q=0.9 (quality factor tanpa kode wilayah)", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Accept-Language", "en;q=0.9,id;q=0.5");

    // Endpoint ini membutuhkan auth, jadi akan mengembalikan 401
    // Kita validasi bahwa pesan 401 dikembalikan dalam bahasa Inggris
    expect(res.status).toBe(401);
    expect(res.body.meta?.message).toBeDefined();
    // Pesan bahasa Inggris tidak mengandung karakter Indonesia seperti "tidak" atau "berhasil"
    expect(res.body.meta.message).not.toMatch(/tidak|berhasil|pengguna/i);
  });

  // ─── Test 3: Cookie lang=en mengubah bahasa response ─────────────────────
  it("mendeteksi preferensi bahasa Inggris dari cookie lang=en", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", "lang=en");

    expect(res.status).toBe(401);
    expect(res.body.meta?.message).toBeDefined();
    // Pesan bahasa Inggris tidak mengandung kata-kata khas Indonesia
    expect(res.body.meta.message).not.toMatch(/tidak|berhasil|pengguna/i);
  });

  // ─── Test 4: Default fallback ke Bahasa Indonesia ─────────────────────────
  it("menggunakan Bahasa Indonesia sebagai default jika tidak ada preferensi bahasa", async () => {
    const res = await request(app)
      .get("/api/auth/me");
    // Tanpa header lang/cookie/Accept-Language

    expect(res.status).toBe(401);
    expect(res.body.meta?.message).toBeDefined();
    // Pesan default harus berupa bahasa Indonesia
    expect(res.body.meta.message).toMatch(/tidak|belum|pengguna|autentikasi/i);
  });
});
