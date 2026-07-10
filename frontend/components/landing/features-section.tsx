import {
  Search,
  BookOpenCheck,
  LayoutDashboard,
  Bell,
  ClipboardCheck,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section
      id="keunggulan"
      className="bg-muted/30 border-border/40 scroll-mt-16 border-t py-24"
    >
      <div className="container mx-auto max-w-7xl px-6 md:px-12">
        {/* Header Section */}
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Fitur Unggulan Sistem Perpustakaan
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
            Berikut adalah modul dan aturan sirkulasi digital yang kami
            tawarkan untuk memudahkan kegiatan literasi sekolah.
          </p>
        </div>

        {/* Grid Kartu - 6 Cards showcasing detailed specs */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Kartu 1 */}
          <Card className="group hover:border-primary/30 dark:hover:border-primary/20 border-border dark:border-white/5 bg-card/45 dark:bg-card/25 relative overflow-hidden backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_rgb(99,102,241,0.04)] hover:shadow-primary/5">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-2 w-fit rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
                <Search className="h-6 w-6" />
              </div>
              <CardTitle className="group-hover:text-primary text-xl font-bold transition-colors">
                Katalog & Stok Real-time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Cari koleksi buku favorit berdasarkan judul, penulis, atau
                kategori dengan informasi stok ketersediaan yang selalu
                terbarui di sistem.
              </p>
            </CardContent>
          </Card>

          {/* Kartu 2 */}
          <Card className="group hover:border-primary/30 dark:hover:border-primary/20 border-border dark:border-white/5 bg-card/45 dark:bg-card/25 relative overflow-hidden backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_rgb(99,102,241,0.04)] hover:shadow-primary/5">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-2 w-fit rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
                <BookOpenCheck className="h-6 w-6" />
              </div>
              <CardTitle className="group-hover:text-primary text-xl font-bold transition-colors">
                Pengajuan Pinjam Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ajukan permohonan pinjam buku mandiri dari layar ponsel
                Anda. Petugas akan meninjau, menyetujui, atau menolak
                permohonan secara real-time.
              </p>
            </CardContent>
          </Card>

          {/* Kartu 3 */}
          <Card className="group hover:border-primary/30 dark:hover:border-primary/20 border-border dark:border-white/5 bg-card/45 dark:bg-card/25 relative overflow-hidden backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_rgb(99,102,241,0.04)] hover:shadow-primary/5">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-2 w-fit rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <CardTitle className="group-hover:text-primary text-xl font-bold transition-colors">
                Dashboard Personal Anggota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pantau transaksi aktif, riwayat buku yang pernah dibaca,
                tanggal pengembalian, serta sisa kuota peminjaman Anda
                dengan transparansi penuh.
              </p>
            </CardContent>
          </Card>

          {/* Kartu 4 */}
          <Card className="group hover:border-primary/30 dark:hover:border-primary/20 border-border dark:border-white/5 bg-card/45 dark:bg-card/25 relative overflow-hidden backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_rgb(99,102,241,0.04)] hover:shadow-primary/5">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-2 w-fit rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <CardTitle className="group-hover:text-primary text-xl font-bold transition-colors">
                Aturan Sirkulasi Adil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Maksimal peminjaman dibatasi 3 buku aktif secara bersamaan,
                serta pemblokiran peminjaman otomatis jika memiliki
                tanggungan buku terlambat.
              </p>
            </CardContent>
          </Card>

          {/* Kartu 5 */}
          <Card className="group hover:border-primary/30 dark:hover:border-primary/20 border-border dark:border-white/5 bg-card/45 dark:bg-card/25 relative overflow-hidden backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_rgb(99,102,241,0.04)] hover:shadow-primary/5">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-2 w-fit rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
                <Bell className="h-6 w-6" />
              </div>
              <CardTitle className="group-hover:text-primary text-xl font-bold transition-colors">
                Notifikasi Keterlambatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sistem mendeteksi keterlambatan secara otomatis dan
                mengirimkan notifikasi peringatan ke dashboard anggota dan
                admin untuk mendorong ketertiban sirkulasi buku.
              </p>
            </CardContent>
          </Card>

          {/* Kartu 6 */}
          <Card className="group hover:border-primary/30 dark:hover:border-primary/20 border-border dark:border-white/5 bg-card/45 dark:bg-card/25 relative overflow-hidden backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_rgb(99,102,241,0.04)] hover:shadow-primary/5">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-2 w-fit rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <CardTitle className="group-hover:text-primary text-xl font-bold transition-colors">
                Validasi Kondisi Aset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pengembalian buku mencatat kondisi fisik (Bagus, Rusak,
                Hilang) lengkap dengan catatan inventaris untuk menjaga
                kelestarian aset pustaka.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
