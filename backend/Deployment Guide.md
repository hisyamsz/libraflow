# Panduan Deployment Aplikasi Perpustakaan (Windows Local Server & Auto-Start)

Dokumen ini berisi panduan untuk melakukan instalasi dan deployment proyek Kerja Praktek (KP) Perpustakaan di fasilitas komputer sekolah. Panduan ini dirancang khusus untuk **OS Windows** menggunakan **Server Lokal (Offline Intranet)** dengan **Laragon** sebagai penyedia database **MySQL/MariaDB** dan **phpMyAdmin**, serta dikonfigurasi agar seluruh aplikasi **otomatis berjalan saat komputer server pertama kali dinyalakan**.

---

## Arsitektur Sistem Lokal (Offline)

Satu komputer di perpustakaan akan bertindak sebagai **PC Server** (menyimpan database, backend, dan frontend). Komputer client lainnya di perpustakaan/sekolah terhubung ke jaringan lokal yang sama (Wi-Fi/LAN) untuk mengakses aplikasi melalui browser.

* **Internet:** **100% Offline** (tidak memerlukan kuota/koneksi internet setelah instalasi).
* **Biaya:** **Gratis selamanya** (tidak ada biaya hosting bulanan).
* **Keamanan:** Data tersimpan lokal di harddisk PC Server sekolah.

---

## Kebutuhan Sistem (PC Server Windows)

Sebelum memulai, pastikan software berikut sudah terinstal di PC Server Windows Anda:
1. **Node.js**: Versi LTS terbaru (v20+ direkomendasikan). Download di [nodejs.org](https://nodejs.org/).
2. **Laragon**: Digunakan untuk mengelola Apache (web server), MySQL/MariaDB (database), dan phpMyAdmin secara lokal. Download di [laragon.org](https://laragon.org/).
3. **Git for Windows** (Opsional): Untuk mempermudah transfer source code.

---

## Langkah 1: Setup Laragon (MySQL/MariaDB + phpMyAdmin) & Konfigurasi Autostart

Langkah ini menjelaskan cara mengonfigurasi Laragon agar database, web server, dan phpMyAdmin otomatis aktif sejak komputer dinyalakan.

### 1. Instalasi & Setup phpMyAdmin di Laragon
Secara default, Laragon menggunakan HeidiSQL sebagai pengelola database desktop. Untuk menambahkan **phpMyAdmin** (berbasis web):
1. Jalankan **Laragon**.
2. Klik kanan di mana saja di jendela Laragon -> arahkan ke **Tools** -> **Quick App** -> klik **phpMyAdmin**.
3. Laragon akan mengunduh dan memasang phpMyAdmin secara otomatis di folder `C:\laragon\etc\apps\phpMyAdmin`.
4. Setelah selesai, pastikan Apache dan MySQL sudah berjalan (klik **Start All**).
5. phpMyAdmin kini dapat diakses di browser melalui alamat: `http://localhost/phpmyadmin` (Username default: `root`, Password default: dikosongkan/empty).

### 2. Membuat Database Baru
1. Buka browser, lalu akses `http://localhost/phpmyadmin`.
2. Klik tab **Database** / **Basis Data**.
3. Masukkan nama database baru: `perpustakaan-db`.
4. Klik **Create** / **Buat**.

### 3. Konfigurasi Autostart Laragon
Agar database MySQL/MariaDB dan phpMyAdmin langsung menyala ketika komputer Windows dihidupkan:
1. Pada aplikasi Laragon, klik kanan di mana saja -> pilih **Preferences**.
2. Pada tab **General**:
   * Centang **Run Laragon when Windows starts** (Laragon terbuka otomatis saat Windows booting).
3. Pada bagian **Services & Ports**:
   * Centang **Apache** (Penting: harus dicentang agar phpMyAdmin web bisa diakses).
   * Centang **MySQL** (Penting: harus dicentang agar database MySQL/MariaDB menyala).
4. Tutup jendela Preferences. Sekarang, setiap kali Windows menyala, Laragon akan berjalan di background dan langsung mengaktifkan MySQL serta Apache secara otomatis.

---

## Langkah 2: Setup & Jalankan Backend (`backend-kp`)

1. Salin folder `backend-kp` ke folder permanen di PC Server Windows (misal: `C:\perpustakaan\backend-kp`).
2. Di root folder `backend-kp`, buat file `.env` baru dan isi sebagai berikut:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/perpustakaan-db"
   JWT_SECRET="kunci_rahasia_jwt_yang_sangat_panjang_dan_aman_129837912"
   PORT=28080
   ```
3. Buka **Command Prompt (CMD)**, masuk ke folder backend:
   ```cmd
   cd C:\perpustakaan\backend-kp
   ```
4. Jalankan perintah instalasi dan pembuatan skema database:
   ```cmd
   # 1. Install seluruh package dependencies
   npm install

   # 2. Sinkronisasi skema Prisma ke database MySQL/MariaDB lokal
   npx prisma db push

   # 3. Build typescript menjadi javascript
   npm run build
   ```
5. Install **PM2** secara global agar backend bisa berjalan di background:
   ```cmd
   npm install -g pm2
   ```
6. Jalankan backend menggunakan PM2:
   ```cmd
   pm2 start dist/index.js --name "backend-library"
   ```

---

## Langkah 3: Setup & Jalankan Frontend (`frontend-kp`)

1. Cari tahu **IP Address Lokal** PC Server Windows:
   * Buka CMD, ketik `ipconfig`, lalu tekan Enter.
   * Cari **IPv4 Address** pada adapter LAN atau Wi-Fi yang aktif (contoh: `192.168.1.46`).
2. Salin folder `frontend-kp` ke PC Server Windows (misal: `C:\perpustakaan\frontend-kp`).
3. Di root folder `frontend-kp`, buat file `.env` baru dan isi sebagai berikut:
   ```env
   NEXT_PUBLIC_API_URL=http://192.168.1.46:28080/api
   NEXTAUTH_SECRET=rahasia_auth_nextjs_yang_aman_dan_random_923847923
   NEXTAUTH_URL=http://192.168.1.46:28000
   ```
   > [!IMPORTANT]
   > Gantilah `192.168.1.46` dengan IP Address Lokal komputer server Anda yang didapatkan dari langkah `ipconfig` tadi. Jangan gunakan `localhost` agar komputer client lain dapat terhubung ke server ini.

4. Buka CMD baru, masuk ke folder frontend:
   ```cmd
   cd C:\perpustakaan\frontend-kp
   ```
5. Jalankan perintah build:
   ```cmd
   # 1. Install dependencies
   npm install

   # 2. Build aplikasi Next.js untuk produksi
   npm run build
   ```
6. Jalankan frontend menggunakan PM2:
   ```cmd
   pm2 start npm --name "frontend-library" -- start -- -p 28000
   ```

---

## Langkah 4: Konfigurasi Jaringan & Windows Firewall

Agar komputer lain di perpustakaan dapat mengakses aplikasi di PC Server:

### 1. Atur IP Static pada PC Server
Agar alamat IP server tidak berubah-ubah saat router atau komputer dimatikan:
1. Buka **Settings** Windows -> **Network & Internet** -> **Properties** jaringan yang tersambung.
2. Pada *IP assignment*, klik **Edit** -> ubah dari *Automatic (DHCP)* menjadi **Manual**.
3. Aktifkan **IPv4** dan masukkan IP statis (misal `192.168.1.46`), Subnet mask (`255.255.255.0`), dan Gateway sesuai router Anda.

### 2. Buka Port 28000 & 28080 di Windows Firewall
1. Tekan tombol Windows, cari **Windows Defender Firewall with Advanced Security**, lalu buka.
2. Di panel kiri, klik **Inbound Rules**.
3. Di panel kanan, klik **New Rule...**
4. Pilih **Port**, lalu klik **Next**.
5. Pilih **TCP**, dan pada bagian *Specific local ports* isi: `28000, 28080`. Klik **Next**.
6. Pilih **Allow the connection**, klik **Next**.
7. Centang ketiga pilihan (Domain, Private, Public), klik **Next**.
8. Beri nama rule ini (misal: `Aplikasi Perpustakaan`), lalu klik **Finish**.

---

## Langkah 5: Konfigurasi Auto-Start Aplikasi Node.js (Sebagai Windows Service via PM2)

Agar backend (`backend-kp`) dan frontend (`frontend-kp`) otomatis berjalan di background (murni tanpa memunculkan jendela CMD yang bisa ditutup tidak sengaja) sesaat setelah Windows menyala, gunakan **PM2 Windows Startup**:

1. Buka **Command Prompt (CMD)** dengan hak akses Administrator (Klik kanan CMD -> pilih **Run as administrator**).
2. Instal utility startup PM2 untuk Windows secara global:
   ```cmd
   npm install -g pm2-windows-startup
   ```
3. Registrasikan PM2 ke dalam sistem startup Windows (akan didaftarkan sebagai Windows Service):
   ```cmd
   pm2-startup install
   ```
4. Pastikan kedua aplikasi Anda (backend & frontend) sedang aktif di PM2. Anda bisa memverifikasinya dengan mengetik:
   ```cmd
   pm2 status
   ```
5. Jika status keduanya adalah `online`, simpan daftar proses tersebut agar PM2 tahu apa yang harus dihidupkan kembali:
   ```cmd
   pm2 save
   ```

Sekarang, setiap kali komputer Windows dihidupkan, PM2 otomatis berjalan di background dan langsung menghidupkan kembali (*resurrect*) backend dan frontend secara aman dan tidak terlihat (silent).

---

## Langkah 6: Cara Akses dari Komputer Client

Setelah instalasi selesai dan server telah berjalan secara otomatis:
1. Hubungkan komputer client (komputer siswa/penjaga perpustakaan lain) ke jaringan Wi-Fi atau kabel LAN yang sama dengan PC Server.
2. Buka web browser (Chrome/Edge/Firefox) di komputer client.
3. Ketik alamat IP lokal server beserta port frontend-nya:
   ```http
   http://192.168.1.46:28000
   ```
4. Aplikasi Perpustakaan siap digunakan sepenuhnya secara offline!
